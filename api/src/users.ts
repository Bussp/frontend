// api/users.ts
import { apiClient } from "./client";
import { LoginResponse, RegisterRequest, User } from "./models/users.types";

/**
 * POST /users/register
 * Cria um novo usuário.
 */
export async function registerUser(payload: RegisterRequest): Promise<User> {
  return apiClient.post<User>("/users/register", payload);
}

/**
 * POST /users/login
 * Faz login e salva o JWT no client.
 */
export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  const body = new URLSearchParams();
  body.append("grant_type", "password");
  body.append("username", email);
  body.append("password", password);
  body.append("scope", "");

  const response = await apiClient.post<LoginResponse>(
    "/users/login",
    body,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  // guarda o token para as próximas chamadas
  apiClient.setToken(response.access_token);

  return response;
}

/**
 * GET /users/me
 * Busca o usuário autenticado (via JWT já salvo no client).
 */
export async function getCurrentUser(): Promise<User> {
  return apiClient.get<User>("/users/me");
}

/**
 * GET /users/{email}
 * Busca um usuário pelo email.
 */
export async function getUserByEmail(email: string): Promise<User> {
  return apiClient.get<User>(`/users/${encodeURIComponent(email)}`);
}
