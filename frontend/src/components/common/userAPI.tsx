
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

if (!API_BASE_URL) {
  console.error("API_BASE_URL is not defined. Check your .env file for REACT_APP_API_BASE_URL.");
}

interface ApiError extends Error {
  statusCode?: number;
  details?: any;
}

interface ConfirmUserPayload {
  username: string; 
}

interface ConfirmUserResponse {
  success: boolean;
  message: string;
}
const headers = {
        'Content-Type': 'application/pdf',
        'Access-Control-Allow-Origin': '*'
      }

const base_headers = {
  'Content-Type': 'application/json'
}
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

export async function ResumeLink() {
  const endpoint = `${API_BASE_URL}/download-resume`;

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
      console.error('ResumeLink API error:', error.details);
      throw error;
    }

    return jsonResponse as { url: string };

  } catch (error) {
    console.error('Network or other error in ResumeLink:', error);
    if ((error as ApiError).statusCode) {
      throw error;
    }
    const apiError: ApiError = new Error((error as Error).message || 'An unexpected error occurred during resume download request.');
    throw apiError;
  }
  
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
interface blogPostPayload{
  title: string;
  content: Text;
}
export async function CreateDraftBlogPost(payload: any) {
  const endpoint = `${API_BASE_URL}/create-blog`;
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }
  const auth_header = {
        'Content-Type': 'application/json',
        'Authorization': token
      }
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: auth_header,
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

export async function UpdateBlogPost(id: string, payload: any) {
  const endpoint = `${API_BASE_URL}/update-blog?id=${id}`;
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }
  const auth_header = {
        'Content-Type': 'application/json',
        'Authorization': token
      }
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: auth_header,
      body: JSON.stringify(payload),
    });

    const jsonResponse = await response.json().catch(() => ({
      message: `Request failed with status ${response.status} and no JSON error body.`,
    }));

    if (!response.ok) {
      const error: ApiError = new Error(jsonResponse.message || `API Error: ${response.status} ${response.statusText}`);
      error.statusCode = response.status;
      error.details = jsonResponse;
      console.error('UpdateBlogPost API error:', error.details);
      throw error;
    }

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

interface BlogPostData {
  id: string;
  title: string;
  content: string;
  reading_time: number;
  status: string;
  images: string[];
  tags: string[];
  updated_at: string;
  created_at: string;
  author: string;
}
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

export async function uploadFileToS3(signedUrl: string, file: File): Promise<string> {
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

interface PresignedUrlResponse {
  url: string;
  fields?: Record<string, string>;
}

export async function getPresignedUrl(fileName: string, fileType: string): Promise<PresignedUrlResponse | null | undefined> {
  const endpoint = `${API_BASE_URL}/get-presigned-url?fileName=${encodeURIComponent(fileName)}`;
  if (!fileName || !fileType) {
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
  } catch (error) {
    console.error('Error getting presigned URL:', error);
    throw error;
  }
}