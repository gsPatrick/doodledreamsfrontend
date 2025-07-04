import api from './api';

const produtoService = {
  /**
   * Busca produtos da API.
   * @param {object} params - Parâmetros de query (ex: { page: 1, limit: 10 })
   */
  async getProdutos(params = {}) {
    const response = await api.get('/api/produtos', { params });
    return response.data;
  },

  /**
   * Busca um produto específico pelo ID.
   * @param {string|number} id - O ID do produto.
   */
  async getProdutoById(id) {
    const response = await api.get(`/api/produtos/${id}`);
    return response.data;
  },

  async getLancamentos(limit = 10) {
    const response = await api.get(`/api/produtos/lancamentos?limit=${limit}`);
    return response.data;
  },

  async getMaisVendidos(limit = 10) {
    const response = await api.get(`/api/produtos/mais-vendidos?limit=${limit}`);
    return response.data;
  },

  // Adicione aqui outras chamadas relacionadas a produtos se necessário
  // Ex: getProdutoById, getProdutos, etc.
};

export default produtoService; 