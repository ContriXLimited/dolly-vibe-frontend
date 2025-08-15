import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

// Base URL for API requests
// Using relative URL with the proxy configuration from next.config.ts
const BASE_URL = "/api";

// Token storage key
const TOKEN_STORAGE_KEY = "auth_token";

// Get stored token from localStorage
export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  }
  return null;
};

// Store token in localStorage
export const setToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  }
};

// Remove token from localStorage
export const removeToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
};

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // Add withCredentials for CORS requests if needed
  // withCredentials: true,
  timeout: 10000, // 10 seconds timeout
});

// Add request interceptor to include auth token in headers
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: Error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if the error is a 401 Unauthorized
    if (error.response?.status === 401) {
      console.log('🚨 Request.ts: 检测到 401 错误', {
        url: error.config?.url,
        method: error.config?.method,
        currentPath: typeof window !== "undefined" ? window.location.pathname : 'unknown',
        hasToken: !!getToken(),
        errorResponse: error.response?.data
      })

      // Don't redirect if we're already on auth pages or callback pages
      const isAuthPage = typeof window !== "undefined" && 
        (window.location.pathname === "/login" ||
         window.location.pathname.startsWith("/auth/") ||
         error.config?.url?.includes("/auth/"));
      
      console.log('🔍 Request.ts: 检查是否为认证页面', {
        isAuthPage,
        pathname: typeof window !== "undefined" ? window.location.pathname : 'unknown'
      })
      
      if (!isAuthPage) {
        console.log('🔄 Request.ts: 清除存储并跳转登录页')
        
        // Clear all storage
        if (typeof window !== "undefined") {
          localStorage.clear();
          sessionStorage.clear();
        }

        // Redirect to login page
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      } else {
        console.log('⏭️ Request.ts: 在认证页面，跳过自动跳转')
      }
    }

    return Promise.reject(error);
  }
);

// Generic request function
export const request = async <T>(
  config: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  try {
    return await api(config);
  } catch (error: unknown) {
    // Handle errors here (e.g., unauthorized, server errors)
    console.error("API request error:", error);
    throw error;
  }
};

export default api;
