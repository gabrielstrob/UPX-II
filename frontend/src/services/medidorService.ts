import api from './api';
import { Medidor, MedidorRequest } from '@/types';

export const medidorService = {
  async getAll(): Promise<Medidor[]> {
    const response = await api.get('/medidores');
    return response.data;
  },

  async getById(id: number): Promise<Medidor> {
    const response = await api.get(`/medidores/${id}`);
    return response.data;
  },

  async getByLocalId(localId: number): Promise<Medidor[]> {
    const response = await api.get(`/medidores/local/${localId}`);
    return response.data;
  },

  async create(data: MedidorRequest): Promise<Medidor> {
    const response = await api.post('/medidores', data);
    return response.data;
  },

  async update(id: number, data: MedidorRequest): Promise<Medidor> {
    const response = await api.put(`/medidores/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/medidores/${id}`);
  }
};
