import { apiRequest } from "./queryClient";

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export async function login(credentials: LoginRequest): Promise<User> {
  const response = await apiRequest("POST", "/api/login", credentials);
  return response.json();
}

export async function register(userData: RegisterRequest): Promise<User> {
  const response = await apiRequest("POST", "/api/register", userData);
  return response.json();
}

export async function logout(): Promise<void> {
  await apiRequest("POST", "/api/logout");
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await apiRequest("GET", "/api/me");
    return response.json();
  } catch (error) {
    return null;
  }
}
