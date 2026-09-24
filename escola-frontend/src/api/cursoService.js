import { api } from './axiosConfig';

export const cursoService = {
  listar: async (busca = '') => {
    const response = await api.get(`/curso?nome=${encodeURIComponent(busca)}`);
    return response.data;
  },
  
  obterPorId: async (id) => {
    const response = await api.get(`/curso/${id}`);
    return response.data;
  },
  
  salvar: async (curso) => {
    if (curso.id) {
      const response = await api.put(`/curso/${curso.id}`, curso);
      return response.data;
    }
    const response = await api.post('/curso', curso);
    return response.data;
  },
  
  excluir: async (id) => {
    await api.delete(`/curso/${id}`);
  }
};