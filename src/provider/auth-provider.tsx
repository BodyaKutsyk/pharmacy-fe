import {
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

import { ApiError, LoginRequest, LoginResponse } from '@/api/api.ts';
import axiosClient from '@/api/axios-client.ts';

interface AuthContext {
  isLoading: boolean;
  isAdmin: boolean;
  isAuthenticated: boolean;
  login: (request: LoginRequest) => Promise<void>;
  logout: () => void;
}

interface JwtPayload {
  sub: string;
  roles: string[];
  exp: number;
  iat: number;
}

const STORAGE_KEY = 'accessToken';

export const AuthContext = createContext<AuthContext>({
  isLoading: false,
  isAuthenticated: false,
  isAdmin: false,
  login: async () => {},
  logout: async () => {},
});

const isValidToken = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch (e) {
    return false;
  }
};

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem(STORAGE_KEY),
  );
  const [isAdmin, setIsAdmin] = useState(false);
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
      const token = res.accessToken;
      const decoded = jwtDecode<JwtPayload>(token);
      console.log(decoded);
      setIsAdmin(res.roles.includes('admin'));
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

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setAccessToken(null);
    setIsAdmin(false);
    delete axiosClient.defaults.headers.common.Authorization;
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem(STORAGE_KEY);

    if (storedToken && isValidToken(storedToken)) {
      try {
        const decoded = jwtDecode<JwtPayload>(storedToken);
        setAccessToken(storedToken);
        setIsAdmin(decoded.roles?.includes('admin') ?? false);
        axiosClient.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
      } catch (error) {
        console.error('Token parsing failed', error);
        logout();
      }
    } else if (storedToken) {
      logout();
    }

    setIsLoading(false);
  }, [logout]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        if (!e.newValue) {
          logout();
        } else {
          setAccessToken(e.newValue);
          const decoded = jwtDecode<JwtPayload>(e.newValue);
          setIsAdmin(decoded.roles?.includes('admin') ?? false);
          axiosClient.defaults.headers.common.Authorization = `Bearer ${e.newValue}`;
        }
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [logout]);

  const value = useMemo(
    () => ({
      isAuthenticated: !!accessToken,
      isLoading,
      login,
      logout,
      isAdmin,
    }),
    [accessToken, isAdmin, isLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
