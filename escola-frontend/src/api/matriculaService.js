import { api } from './axiosConfig';

export const matriculaService = {
  listar: async () => {
    const response = await api.get('/matricula');
    return response.data;
  },
  
  obterPorId: async (id) => {
    const response = await api.get(`/matricula/${id}`);
    return response.data;
  },
  
  salvar: async (matricula) => {
    if (matricula.id) {
      const response = await api.put(`/matricula/${matricula.id}`, matricula);
      return response.data;
    }
    const response = await api.post('/matricula', matricula);
    return response.data;
  },
  
  excluir: async (id) => {
    await api.delete(`/matricula/${id}`);
  }
};