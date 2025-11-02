/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import axios, { AxiosError } from 'axios';

import { ApiError } from '@/api/api.ts';
import { LOGIN_PATH } from '@/data';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
// Interceptors
// Add a request interceptor
axiosClient.interceptors.request.use(function (config) {
  // Do something before request is sent
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers['Authorization'] = 'Bearer ' + token;
  }

  return config;
});

axiosClient.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError<ApiError>) => {
    if (
      !window.location.pathname.includes(LOGIN_PATH) &&
      error.response?.status === 401
    ) {
      localStorage.removeItem('accessToken');
      window.location.replace(LOGIN_PATH);
    }
    return Promise.reject(error);
  },
);

export default axiosClient;
