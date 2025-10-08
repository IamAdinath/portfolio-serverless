
import type { 
  ApiError, 
  ConfirmUserPayload, 
  ConfirmUserResponse, 
  BlogPostData, 
  BlogPostPayload,
  PresignedUrlApiResponse,
  HttpHeaders
} from '../../types';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

if (!API_BASE_URL) {
  console.error("API_BASE_URL is not defined. Check your .env file for REACT_APP_API_BASE_URL.");
}
const headers: HttpHeaders = {
  'Content-Type': 'application/pdf',
  'Access-Control-Allow-Origin': '*'
}

const base_headers: HttpHeaders = {
  'Content-Type': 'application/json'
}

// Helper function to get authenticated headers
const getAuthHeaders = (): HttpHeaders => {
  const token = localStorage.getItem('authToken');
  return {
    ...base_headers,
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};
/**
 * Calls the backend API to trigger administrative confirmation of a newly signed-up user.
 * This endpoint on your backend must be appropriately secured.
 *
 * @param payload - Contains the Cognito username of the user to confirm.
 * @returns Promise<ConfirmUserResponse>
 */
export async function requestUserConfirmation(payload: ConfirmUserPayload): Promise<ConfirmUserResponse> {
  const endpoint = `${API_BASE_URL}/confirm-user`; 

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: base_headers,
      body: JSON.stringify(payload),
    });

    const jsonResponse = await response.json().catch(() => ({
      message: `Request failed with status ${response.status} and no JSON error body.`,
    }));

    if (!response.ok) {
      const error: ApiError = new Error(jsonResponse.message || `API Error: ${response.status} ${response.statusText}`);
      error.statusCode = response.status;
      error.details = jsonResponse;
      console.error('requestUserConfirmation API error:', error.details);
      throw error;
    }

    return jsonResponse as ConfirmUserResponse;

  } catch (error) {
    console.error('Network or other error in requestUserConfirmation:', error);
    if ((error as ApiError).statusCode) {
      throw error;
    }
    const apiError: ApiError = new Error((error as Error).message || 'An unexpected error occurred during user confirmation request.');
    throw apiError;
  }
}

// Unified media API function
async function getMediaFile(fileType: 'profile' | 'resume') {
  const endpoint = `${API_BASE_URL}/get-media?type=${fileType}`;

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: base_headers,
    });

    const jsonResponse = await response.json().catch(() => ({
      message: `Request failed with status ${response.status} and no JSON error body.`,
    }));

    if (!response.ok) {
      const error: ApiError = new Error(jsonResponse.message || `API Error: ${response.status} ${response.statusText}`);
      error.statusCode = response.status;
      error.details = jsonResponse;
      console.error(`Get${fileType}File API error:`, error.details);
      throw error;
    }

    return jsonResponse;

  } catch (error) {
    console.error(`Network or other error in get${fileType}File:`, error);
    if ((error as ApiError).statusCode) {
      throw error;
    }
    const apiError: ApiError = new Error((error as Error).message || `An unexpected error occurred during ${fileType} file request.`);
    throw apiError;
  }
}

export async function ResumeLink() {
  const response = await getMediaFile('resume');
  return response.downloadUrl;
}

export async function DownloadResume() {
  const response = await getMediaFile('resume');
  return response;
}

export async function GetProfileImage() {
  const response = await getMediaFile('profile');
  return response.imageUrl;
}

export async function GetFile(fileURL: string) {
  try {
    const response = await fetch(fileURL, {
      method: 'GET',
      headers: headers,
    });

    if (!response.ok) {
      const error: ApiError = new Error(`API Error: ${response.status} ${response.statusText}`);
      error.statusCode = response.status;
      console.error('GetFile API error:', error);
      throw error;
    }

    const blob = await response.blob();
    return blob;

  } catch (error) {
    console.error('Network or other error in GetFile:', error);
    if ((error as ApiError).statusCode) {
      throw error;
    }
    const apiError: ApiError = new Error((error as Error).message || 'An unexpected error occurred during file download.');
    throw apiError;
  }
};

export async function CreateDraftBlogPost(payload: BlogPostPayload) {
  const endpoint = `${API_BASE_URL}/create-blog`;
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Authentication required. Please log in.');
  }
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    const jsonResponse = await response.json().catch(() => ({
      message: `Request failed with status ${response.status} and no JSON error body.`,
    }));

    if (!response.ok) {
      const error: ApiError = new Error(jsonResponse.message || `API Error: ${response.status} ${response.statusText}`);
      error.statusCode = response.status;
      error.details = jsonResponse;
      console.error('CreateBlogPost API error:', error.details);
      throw error;
    }

    return jsonResponse;

  } catch (error) {
    console.error('Network or other error in CreateBlogPost:', error);
    if ((error as ApiError).statusCode) {
      throw error;
    }
    const apiError: ApiError = new Error((error as Error).message || 'An unexpected error occurred during blog post creation.');
    throw apiError;
  }
};

export async function UpdateBlogPost(id: string, payload: BlogPostPayload) {
  const endpoint = `${API_BASE_URL}/update-blog?id=${id}`;
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Authentication required. Please log in.');
  }
  
  console.log(`Updating blog ${id} with payload:`, payload);
  
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    const jsonResponse = await response.json().catch(() => ({
      message: `Request failed with status ${response.status} and no JSON error body.`,
    }));

    if (!response.ok) {
      // If update endpoint doesn't exist (404), log it but still throw error
      if (response.status === 404) {
        console.error('Update endpoint not found. Make sure to deploy the UpdateBlogsLambda function.');
      }
      
      const error: ApiError = new Error(jsonResponse.message || `API Error: ${response.status} ${response.statusText}`);
      error.statusCode = response.status;
      error.details = jsonResponse;
      console.error('UpdateBlogPost API error:', error.details);
      throw error;
    }

    console.log('Update successful:', jsonResponse);
    return jsonResponse;

  } catch (error) {
    console.error('Network or other error in UpdateBlogPost:', error);
    if ((error as ApiError).statusCode) {
      throw error;
    }
    const apiError: ApiError = new Error((error as Error).message || 'An unexpected error occurred during blog post update.');
    throw apiError;
  }
};

export async function GetBlogPosts() {
  const endpoint = `${API_BASE_URL}/get-blogs`;
  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: base_headers,
    });

    const jsonResponse = await response.json().catch(() => ({
      message: `Request failed with status ${response.status} and no JSON error body.`,
    }));

    if (!response.ok) {
      const error: ApiError = new Error(jsonResponse.message || `API Error: ${response.status} ${response.statusText}`);
      error.statusCode = response.status;
      error.details = jsonResponse;
      console.error('GetBlogPosts API error:', error.details);
      throw error;
    }
    const BlogList = jsonResponse.blogs;
    return BlogList;

  } catch (error) {
    console.error('Network or other error in GetBlogPosts:', error);
    if ((error as ApiError).statusCode) {
      throw error;
    }
    const apiError: ApiError = new Error((error as Error).message || 'An unexpected error occurred during blog post retrieval.');
    throw apiError;
  }
};


export async function GetBlogPostById(id: string) {
  const endpoint = `${API_BASE_URL}/get-blog?id=${id}`;
  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: base_headers,
    });

    const rawStringResponse = await response.json().catch(() => ({
      message: `Request failed with status ${response.status} and no JSON error body.`,
    }));

    if (!response.ok) {
      const error: ApiError = new Error(rawStringResponse.message || `API Error: ${response.status} ${response.statusText}`);
      error.statusCode = response.status;
      error.details = rawStringResponse;
      console.error('GetBlogPostById API error:', error.details);
      throw error;
    }
    const parsedData = JSON.parse(rawStringResponse);
    console.log('Parsed data (object):', parsedData);

    if (parsedData && typeof parsedData === 'object' && parsedData.id) {
      const jsonResponse = parsedData as BlogPostData;
      console.log('Parsed data is a valid blog post:', jsonResponse);
      
      return jsonResponse;
    } else {
      throw new Error('Parsed data is not a valid blog post.');
    }

  } catch (error) {
    console.error('Network or other error in GetBlogPostById:', error);
    if ((error as ApiError).statusCode) {
      throw error;
    }
    const apiError: ApiError = new Error((error as Error).message || 'An unexpected error occurred during blog post retrieval by ID.');
    throw apiError;
  }
}

export async function DeleteBlogPost(id: string) {
  const endpoint = `${API_BASE_URL}/delete-blog?id=${id}`;
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Authentication required. Please log in.');
  }
  
  try {
    const response = await fetch(endpoint, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    const jsonResponse = await response.json().catch(() => ({
      message: `Request failed with status ${response.status} and no JSON error body.`,
    }));

    if (!response.ok) {
      const error: ApiError = new Error(jsonResponse.message || `API Error: ${response.status} ${response.statusText}`);
      error.statusCode = response.status;
      error.details = jsonResponse;
      console.error('DeleteBlogPost API error:', error.details);
      throw error;
    }

    return jsonResponse;

  } catch (error) {
    console.error('Network or other error in DeleteBlogPost:', error);
    if ((error as ApiError).statusCode) {
      throw error;
    }
    const apiError: ApiError = new Error((error as Error).message || 'An unexpected error occurred during blog post deletion.');
    throw apiError;
  }
}

export async function putFileToS3(signedUrl: string, file: File): Promise<string> {
  try {
    const response = await fetch(signedUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload file: ${response.status} ${response.statusText}`);
    }

    // Return the final URL of the uploaded file
    return signedUrl.split('?')[0]; // Assuming the signed URL is the final URL
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw error;
  }
}



export async function uploadFileToS3(fileName: string, file_content: any): Promise<any | null | undefined> {
  const endpoint = `${API_BASE_URL}/upload-to-s3`;
  if (!fileName || !file_content) {
    console.error('File name or type is missing for presigned URL request.');
    return null;
  }

  const body = {
    "fileName": fileName,
    "file_content": file_content,
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: base_headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Failed to upload file: ${response.status} ${response.statusText}`);
    }

    const jsonResponse = await response.json();
    return jsonResponse;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}



export async function getPresignedUrl(fileName: string): Promise<PresignedUrlApiResponse | null> {
  const endpoint = `${API_BASE_URL}/get-presigned-url?fileName=${encodeURIComponent(fileName)}`;
  if (!fileName) {
    console.error('File name or type is missing for presigned URL request.');
    return null;
  }

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: base_headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to get presigned URL: ${response.status} ${response.statusText}`);
    }

    const jsonResponse = await response.json();
    return jsonResponse as PresignedUrlApiResponse;

  } catch (error) {
    console.error('Error getting presigned URL:', error);
    throw error;
  }
}