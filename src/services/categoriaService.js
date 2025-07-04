import api from './api';

const categoriaService = {
  /**
   * Busca todas as categorias da API.
   */
  async getCategorias() {
    const response = await api.get('/api/categorias/');
    return response.data;
  }
};

export default categoriaService; 