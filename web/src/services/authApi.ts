import api from "./common";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  _id: string;
  username: string;
  email: string;
}

export interface LoginResponse {
    token: string;
    user: User;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export const authApi = {
  login: (data: LoginRequest) => api.post<LoginResponse>("/login", data),
  register: (data: RegisterRequest) => api.post<User>("/register", data),
  logout: () => api.delete<void>("/logout"),
};
