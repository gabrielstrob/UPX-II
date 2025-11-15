import api, { apiClient } from './api';
import { Usuario, UsuarioRequest, UsuarioUpdateRequest } from '@/types';

export const usuarioService = {
  async getAll(): Promise<Usuario[]> {
    const response = await api.get('/usuarios');
    return response.data;
  },

  async getById(id: number): Promise<Usuario> {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  },

  async create(data: UsuarioRequest): Promise<Usuario> {
    const response = await api.post('/usuarios', data);
    return response.data;
  },

  async update(id: number, data: UsuarioUpdateRequest): Promise<Usuario> {
    const response = await api.put(`/usuarios/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/usuarios/${id}`);
  },

  async login(email: string, senha: string): Promise<Usuario> {
    // Configura credenciais para todas as próximas requisições
    apiClient.setAuth(email, senha);
    
    // Tenta buscar todos os usuários (se autenticado, retorna a lista)
    const usuarios = await this.getAll();
    
    // Encontra o usuário pelo email
    const usuario = usuarios.find(u => u.email === email);
    
    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }
    
    return usuario;
  },

  logout() {
    apiClient.clearAuth();
  }
};
