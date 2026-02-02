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
  const { data, headers, ...customConfig } = options;
  
  // Get token from localStorage
  const token = getToken();

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
    // 默认不设置超时，除非显式传入 timeout 参数
    let id: NodeJS.Timeout | undefined;
    if (customConfig.timeout) {
      const controller = new AbortController();
      id = setTimeout(() => {
        controller.abort();
      }, customConfig.timeout);
      config.signal = controller.signal;
    }

    try {
      const response = await fetch(`${BASE_URL}${url}`, config);
      if (id) clearTimeout(id);
      
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
    } catch (fetchError: any) {
      if (id) clearTimeout(id);
      // Normalize timeout/abort error
      if (fetchError.name === 'AbortError' || fetchError.message?.includes('aborted')) {
        throw new Error('请求超时，请检查网络');
      }
      throw fetchError;
    }
  } catch (error) {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
}

export default request;