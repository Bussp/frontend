// api/src/providers/AuthProvider.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiClient } from '../client';
import { User } from '../models/users.types';
import { getCurrentUser } from '../requests/users';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verifica se o usuário está autenticado ao iniciar o app
  const checkAuth = async () => {
    setIsLoading(true);
    try {
      // Inicializa o cliente API (carrega token do storage)
      await apiClient.initialize();
      
      // Se houver token, tenta buscar dados do usuário
      if (apiClient.hasToken()) {
        try {
          const userData = await getCurrentUser();
          setUser(userData);
        } catch (error: any) {
          console.error('Erro ao buscar dados do usuário:', error);
          
          // Só limpa o token se for erro de autenticação (401/403)
          // Mantém o token se for erro de rede ou servidor
          if (error?.response?.status === 401 || error?.response?.status === 403) {
            console.log('Token inválido ou expirado, fazendo logout...');
            await apiClient.clearToken();
            setUser(null);
          } else {
            // Erro de rede ou servidor - mantém o token mas não seta o usuário
            console.log('Erro de conexão, mantendo token para tentar depois');
            setUser(null);
          }
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Erro ao inicializar autenticação:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Faz logout
  const logout = async () => {
    await apiClient.clearToken();
    setUser(null);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: user !== null,
        setUser,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
