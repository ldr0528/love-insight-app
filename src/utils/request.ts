// src/utils/request.ts
import { useAuthStore } from '../store/useAuthStore';

interface RequestOptions extends RequestInit {
  data?: any;
}

const BASE_URL = ''; // Relative path since we proxy or serve from same origin

async function request<T = any>(url: string, options: RequestOptions = {}): Promise<T> {
  const { data, headers, ...customConfig } = options;
  
  // Get token from Zustand store (it handles localStorage sync)
  const token = useAuthStore.getState().token;

  const config: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...customConfig,
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${BASE_URL}${url}`, config);
    
    // Handle 401 Unauthorized globally
    if (response.status === 401) {
      // Only logout if we had a token (avoid loops on public endpoints)
      if (token) {
        useAuthStore.getState().logout();
      }
      return Promise.reject(new Error('Unauthorized'));
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
}

export default request;
