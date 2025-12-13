/**
 * 인증 관련 타입 정의
 * 
 * 기능: 로그인, 회원가입, 사용자 프로필 관련 타입 정의
 */

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
