interface RequestOptions extends RequestInit {
  data?: any;
  timeout?: number;
}

const BASE_URL = ''; // Relative path since we proxy or serve from same origin

// Helper to get token from localStorage to avoid circular dependency
const getToken = () => {
  try {
    const storage = localStorage.getItem('auth-storage');
    if (storage) {
      const parsed = JSON.parse(storage);
      return parsed.state?.token;
    }
  } catch (e) {
    // ignore
  }
  return null;
};

async function request<T = any>(url: string, options: RequestOptions = {}): Promise<T> {
  const { data, headers, timeout = 30000, ...customConfig } = options;
  
  // Get token from localStorage
  const token = getToken();

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const config: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    signal: controller.signal,
    ...customConfig,
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${BASE_URL}${url}`, config);
    clearTimeout(id);
    
    // Handle 401 Unauthorized globally
    if (response.status === 401) {
      // Dispatch a custom event for the store to listen to
      if (token) {
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
      }
      return Promise.reject(new Error('Unauthorized'));
    }

    const responseData = await response.json();
    return responseData;
  } catch (error: any) {
    clearTimeout(id);
    console.error('Request Error:', error);
    
    // Handle specific errors
    if (error.name === 'AbortError') {
       return Promise.reject(new Error('请求超时或已取消，请检查网络连接'));
    }
    
    return Promise.reject(error);
  }
}

export default request;