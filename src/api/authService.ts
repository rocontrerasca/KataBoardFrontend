import api from "./axios";

interface AuthRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export const login = (data: AuthRequest): Promise<AuthResponse> => {
  return api.post("/auth/login", data).then(res => res.data);
};

export const register = (data: RegisterRequest): Promise<void> => {
  return api.post("/auth/register", data).then(res => res.data);
};
