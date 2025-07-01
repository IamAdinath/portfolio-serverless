
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
      headers: {
        'Content-Type': 'application/json',
      },
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

export async function DownloadResume() {
  const endpoint = `${API_BASE_URL}/download-resume`;

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const jsonResponse = await response.json().catch(() => ({
      message: `Request failed with status ${response.status} and no JSON error body.`,
    }));

    if (!response.ok) {
      const error: ApiError = new Error(jsonResponse.message || `API Error: ${response.status} ${response.statusText}`);
      error.statusCode = response.status;
      error.details = jsonResponse;
      console.error('DownloadResume API error:', error.details);
      throw error;
    }

    return jsonResponse as { url: string };

  } catch (error) {
    console.error('Network or other error in DownloadResume:', error);
    if ((error as ApiError).statusCode) {
      throw error;
    }
    const apiError: ApiError = new Error((error as Error).message || 'An unexpected error occurred during resume download request.');
    throw apiError;
  }
  
}