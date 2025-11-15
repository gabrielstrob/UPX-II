import api from './api';
import { Local, LocalRequest } from '@/types';

export const localService = {
  async getAll(): Promise<Local[]> {
    const response = await api.get('/locais');
    return response.data;
  },

  async getById(id: number): Promise<Local> {
    const response = await api.get(`/locais/${id}`);
    return response.data;
  },

  async getByUsuarioId(usuarioId: number): Promise<Local[]> {
    const response = await api.get(`/locais/usuario/${usuarioId}`);
    return response.data;
  },

  async create(data: LocalRequest): Promise<Local> {
    const response = await api.post('/locais', data);
    return response.data;
  },

  async update(id: number, data: LocalRequest): Promise<Local> {
    const response = await api.put(`/locais/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/locais/${id}`);
  }
};
