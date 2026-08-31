const API_BASE = '/api';

export async function request(endpoint, options = {}) {
  const token = localStorage.getItem('interviewverse_token');
  const headers = {
    ...options.headers
  };

  // If not multipart form data, default to application/json
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    if (response.status === 401) {
      // Don't auto-redirect if checking status or logging in
      if (!endpoint.includes('/auth/')) {
        localStorage.removeItem('interviewverse_token');
        localStorage.removeItem('interviewverse_user');
      }
    }

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error || data.message || `Request failed with status ${response.status}`);
    }
    return data;
  } catch (error) {
    console.error(`API Error on [${options.method || 'GET'}] ${endpoint}:`, error);
    throw error;
  }
}
