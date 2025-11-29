// api/users.types.ts

// Resposta básica de usuário que o backend retorna
export interface User {
  name: string;
  email: string;
  score: number;
}

// Corpo do POST /users/register
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

// Resposta do POST /users/login
export interface LoginResponse {
  access_token: string;
  token_type: "bearer";
}
