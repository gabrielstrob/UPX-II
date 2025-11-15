import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = '/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  setAuth(email: string, senha: string) {
    const credentials = btoa(`${email}:${senha}`);
    this.client.defaults.headers.common['Authorization'] = `Basic ${credentials}`;
  }

  clearAuth() {
    delete this.client.defaults.headers.common['Authorization'];
  }

  getInstance() {
    return this.client;
  }
}

export const apiClient = new ApiClient();
export default apiClient.getInstance();
