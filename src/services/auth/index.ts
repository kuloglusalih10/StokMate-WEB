import { request } from "../request";

export type LoginUser = {
  id: number;
  email: string;
  fullName: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: LoginUser;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export const login = (payload: LoginPayload) =>
  request<LoginResponse>("/auth/login", "POST", payload);

export const refresh = (refreshToken: string) =>
  request<LoginResponse>("/auth/refresh", "POST", { refreshToken });

export const logout = (refreshToken: string) =>
  request<void>("/auth/logout", "POST", { refreshToken });

export const getMe = () => request<LoginUser>("/auth/me", "GET");
