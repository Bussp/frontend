// api/src/client.ts
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { deleteToken, getToken, saveToken } from "./utils/secureStorage";

// Lê a URL da API das variáveis de ambiente
// Configure no arquivo .env: EXPO_PUBLIC_API_URL=http://SEU_IP:8000
// Fallback para localhost se não estiver configurado
const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://56.124.99.21:8000";

class APIClient {
  private client: AxiosInstance;
  private token: string | null = null;
  private isInitialized: boolean = false;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      timeout: 15000, // Aumentado de 5s para 15s
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

  /** Inicializa o cliente carregando o token salvo */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      const savedToken = await getToken();
      if (savedToken) {
        this.token = savedToken;
      }
      this.isInitialized = true;
    } catch (error) {
      console.error('Erro ao inicializar APIClient:', error);
      this.isInitialized = true;
    }
  }

  /** Salva o token depois de logar */
  async setToken(token: string): Promise<void> {
    this.token = token;
    await saveToken(token);
  }

  /** Remove o token (logout) */
  async clearToken(): Promise<void> {
    this.token = null;
    await deleteToken();
  }

  /** Verifica se há token salvo */
  hasToken(): boolean {
    return this.token !== null;
  }

  /** Retorna o token atual */
  getStoredToken(): string | null {
    return this.token;
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
