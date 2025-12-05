import { apiClient } from "../client";
import type {
    TokenResponse,
    User,
    UserCreateAccountRequest,
} from "../models/users.types";

/**
 * POST /users/register
 * Creates a new user account.
 */
export async function registerUser(
  payload: UserCreateAccountRequest
): Promise<User> {
  return apiClient.post<User>("/users/register", payload);
}

/**
 * POST /users/login
 * Authenticates a user and returns a JWT token.
 * The token is automatically saved in the API client for subsequent requests.
 */
export async function loginUser(
  email: string,
  password: string
): Promise<TokenResponse> {
  const body = new URLSearchParams();
  body.append("grant_type", "password");
  body.append("username", email);
  body.append("password", password);
  body.append("scope", "");

  const response = await apiClient.post<TokenResponse>("/users/login", body, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  // Store the token for subsequent requests (now persists across sessions)
  await apiClient.setToken(response.access_token);

  return response;
}

/**
 * GET /users/me
 * Gets the currently authenticated user.
 */
export async function getCurrentUser(): Promise<User> {
  return apiClient.get<User>("/users/me");
}

/**
 * Clears the authentication token (logout).
 */
export async function logoutUser(): Promise<void> {
  await apiClient.clearToken();
}
