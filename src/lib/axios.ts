import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_URL = "http://localhost:5000";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

const refreshAxios = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

const getCurrentLocale = (): string => {
  if (typeof window === 'undefined') return 'hy';
  const match = window.location.pathname.match(/^\/(en|ru|hy)/);
  return match ? match[1] : 'hy';
};

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const locale = getCurrentLocale();

  if (!config.params) config.params = {};
  config.params.lang = locale;

  if (typeof window !== 'undefined') {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  }

  return config;
});

let isRefreshing = false;

type FailedQueueItem = {
  resolve: (value?: unknown) => void;
  reject: (error: unknown) => void;
};

let failedQueue: FailedQueueItem[] = [];

const processQueue = (error: unknown) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(true);
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    if (originalRequest?.url?.includes('/auth/refresh-admin')) {
      return Promise.reject(error);
    }

    if (error.response?.status !== 401 && error.response?.status !== 403) {
      return Promise.reject(error);
    }

    if (typeof window !== 'undefined') {
      const path = window.location.pathname.replace(/^\/(en|ru|hy)/, '') || '/';
      if (path === '/login') return Promise.reject(error);
    }

    if (originalRequest._retry) return Promise.reject(error);

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => axiosInstance(originalRequest));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await refreshAxios.post('/auth/refresh-admin', null, { withCredentials: true });
      const access = (data as any).accessToken ?? (data as any).newAccessToken;
      if (!access) throw new Error('Invalid refresh response');

      if (typeof window !== 'undefined') {
        const maxAge = 60 * 60;
        document.cookie = `access_token=${access}; path=/; max-age=${maxAge}; samesite=none; secure`;
        localStorage.setItem('accessToken', access);
      }

      isRefreshing = false;
      processQueue(null);

      return axiosInstance(originalRequest);
    } catch (refreshError) {
      isRefreshing = false;
      processQueue(refreshError);

      if (typeof window !== 'undefined') {
        document.cookie = 'access_token=; path=/; max-age=0; samesite=none; secure';
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
      }

      return Promise.reject(refreshError);
    }
  }
);

export default axiosInstance;
