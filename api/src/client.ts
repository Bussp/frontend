// api/src/client.ts
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

const API_URL = "http://56.124.99.21:8000"; // sua URL local do FastAPI

class APIClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      timeout: 5000,
    });

    // Adiciona JWT automaticamente
    this.client.interceptors.request.use((config) => {
      if (this.token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });
  }

  /** Salva o token depois de logar */
  setToken(token: string) {
    this.token = token;
  }

  /** Remove o token (logout) */
  clearToken() {
    this.token = null;
  }

  /** Métodos padrão */
  async get<T>(url: string, config?: AxiosRequestConfig) {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig) {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

export const apiClient = new APIClient();
