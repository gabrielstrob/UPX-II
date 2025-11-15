import api from './api';
import { Leitura, LeituraRequest } from '@/types';

export const leituraService = {
  async getByMedidorId(medidorId: number): Promise<Leitura[]> {
    const response = await api.get(`/leituras/medidor/${medidorId}`);
    return response.data;
  },

  async create(data: LeituraRequest): Promise<Leitura> {
    const response = await api.post('/leituras', data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/leituras/${id}`);
  }
};
