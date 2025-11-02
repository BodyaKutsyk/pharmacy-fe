import {
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import axios from 'axios';

import { ApiError, LoginRequest, LoginResponse } from '@/api/api.ts';
import axiosClient from '@/api/axios-client.ts';

interface AuthContext {
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (request: LoginRequest) => Promise<void>;
}

const STORAGE_KEY = 'accessToken';

export const AuthContext = createContext<AuthContext>({
  isLoading: false,
  isAuthenticated: false,
  login: async () => {},
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem(STORAGE_KEY),
  );
  const [isLoading, setIsLoading] = useState(true);

  const login = useCallback(async ({ email, password }: LoginRequest) => {
    try {
      setIsLoading(true);
      const res = await axiosClient.post<LoginResponse, LoginResponse>(
        '/auth/login',
        {
          email,
          password,
        },
      );
      localStorage.setItem(STORAGE_KEY, res.accessToken);
      setAccessToken(res.accessToken);
      axiosClient.defaults.headers.common.Authorization = `Bearer ${res.accessToken}`;
      setIsLoading(false);
    } catch (e: unknown) {
      let msg = 'Failed to login. Please try again.';
      if (axios.isAxiosError<ApiError>(e)) {
        msg = e.response?.data?.message ?? e.message ?? msg;
      } else if (e instanceof Error) {
        msg = e.message;
      }
      setIsLoading(false);
      throw new Error(msg);
    }
  }, []);

  useEffect(() => {
    const accessToken = localStorage.getItem(STORAGE_KEY);

    if (accessToken) {
      setAccessToken(accessToken);
      axiosClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        const t = e.newValue;
        setAccessToken(t || '');
        if (t) {
          axiosClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        } else {
          delete axiosClient.defaults.headers.common.Authorization;
        }
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [accessToken]);

  const value = useMemo(
    () => ({
      isAuthenticated: !!accessToken,
      isLoading: isLoading,
      login,
    }),
    [accessToken, isLoading, login],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
