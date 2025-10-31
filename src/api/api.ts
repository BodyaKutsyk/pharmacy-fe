export type LoginRequest = { email: string; password: string };

export type LoginResponse = { accessToken: string };

export type ApiError = {
  message: string;
  code?: string | number;
  errors?: unknown;
};
