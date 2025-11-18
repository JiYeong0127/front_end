export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  username: string;
  userId?: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  name: string;
  password: string;
}

export interface RegisterResponse {
  message?: string;
  user?: {
    id: string;
    username: string;
    name: string;
    email: string;
  };
}

export interface UsernameExistsResponse {
  exists: boolean;
}

export interface UserProfile {
  id: string;
  username: string;
  name: string;
  email: string;
}
