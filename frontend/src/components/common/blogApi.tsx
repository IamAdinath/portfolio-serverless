import { url } from "inspector";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || process.env.REACT_APP_API_BASE_URL;

interface ApiError extends Error {
  statusCode?: number;
  details?: any;
}

export async function createBlog(
  token: string,
  data: {
    title: string;
    content: string;
    tags?: string[];
    reading_time?: number;
    images?: string[];
  }
): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/create-blog`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const json = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error: ApiError = new Error(json.message || 'API Error');
    error.statusCode = response.status;
    error.details = json;
    throw error;
  }

  return json;
}

export async function getBlogs(id: number) {
    let endpoint = `${API_BASE_URL}/get-blog/${id}`
    if (id==0){
        endpoint = `${API_BASE_URL}/get-blog/`
    }
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    const json = await response.json().catch(() => ({}));
  
    if (!response.ok) {
      const error: ApiError = new Error(json.message || 'API Error');
      error.statusCode = response.status;
      error.details = json;
      throw error;
    }
  
    return json;
  }