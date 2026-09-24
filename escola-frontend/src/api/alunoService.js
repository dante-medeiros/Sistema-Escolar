import { api } from './axiosConfig';

export const alunoService = {
  listar: async (busca = '') => {
    const response = await api.get(`/aluno?nome=${encodeURIComponent(busca)}`);
    return response.data;
  },
  
  obterPorId: async (id) => {
    const response = await api.get(`/aluno/${id}`);
    return response.data;
  },
  
  salvar: async (aluno) => {
    if (aluno.id) {
      const response = await api.put(`/aluno/${aluno.id}`, aluno);
      return response.data;
    }
    const response = await api.post('/aluno', aluno);
    return response.data;
  },
  
  excluir: async (id) => {
    await api.delete(`/aluno/${id}`);
  }
};