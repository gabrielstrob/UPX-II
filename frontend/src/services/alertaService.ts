import api from './api';
import { Alerta, AlertaRequest } from '@/types';

export const alertaService = {
  async getByMedidorId(medidorId: number): Promise<Alerta[]> {
    const response = await api.get(`/alertas/medidor/${medidorId}`);
    return response.data;
  },

  async create(data: AlertaRequest): Promise<Alerta> {
    const response = await api.post('/alertas', data);
    return response.data;
  },

  async update(id: number, data: AlertaRequest): Promise<Alerta> {
    const response = await api.put(`/alertas/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/alertas/${id}`);
  }
};
