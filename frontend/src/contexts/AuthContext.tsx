import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Usuario, LoginCredentials } from '@/types';
import { usuarioService } from '@/services/usuarioService';

interface AuthContextData {
  user: Usuario | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verifica se existe um usuário salvo no localStorage
    const loadUser = () => {
      try {
        const savedUser = localStorage.getItem('@WaterSystem:user');
        const savedCredentials = localStorage.getItem('@WaterSystem:credentials');
        
        if (savedUser && savedCredentials) {
          const parsedUser = JSON.parse(savedUser);
          const [email, senha] = atob(savedCredentials).split(':');
          
          // Reconfigura as credenciais no axios
          usuarioService.login(email, senha)
            .then(() => {
              setUser(parsedUser);
            })
            .catch(() => {
              // Se falhar, limpa o localStorage
              localStorage.removeItem('@WaterSystem:user');
              localStorage.removeItem('@WaterSystem:credentials');
            });
        }
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async ({ email, senha }: LoginCredentials) => {
    try {
      const usuario = await usuarioService.login(email, senha);
      
      // Salva no localStorage
      const credentials = btoa(`${email}:${senha}`);
      localStorage.setItem('@WaterSystem:user', JSON.stringify(usuario));
      localStorage.setItem('@WaterSystem:credentials', credentials);
      
      setUser(usuario);
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  };

  const logout = () => {
    usuarioService.logout();
    localStorage.removeItem('@WaterSystem:user');
    localStorage.removeItem('@WaterSystem:credentials');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
