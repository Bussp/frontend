// api/src/models/users.types.ts

/**
 * User information returned by the backend.
 */
export interface User {
  name: string;
  email: string;
  score: number;
}

/**
 * Request body for POST /users/register.
 */
export interface UserCreateAccountRequest {
  name: string;
  email: string;
  password: string;
}

/**
 * Response from POST /users/login.
 */
export interface TokenResponse {
  access_token: string;
  token_type: "bearer";
}
