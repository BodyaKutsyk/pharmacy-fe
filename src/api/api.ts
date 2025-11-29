export type LoginRequest = { email: string; password: string };

export type Role = 'pharmacist' | 'admin';

export type LoginResponse = { accessToken: string; roles: Role[] };

export type ApiError = {
  message: string;
  code?: string | number;
  errors?: unknown;
};
