export default {
  /**
   * Cria um novo pedido.
   * @param {object} orderData - Dados do pedido (enderecoEntregaId, freteId, etc)
   * @returns {Promise<object>} Pedido criado
   */
  async createOrder(orderData) {
    const api = (await import('./api')).default;
    // O backend espera um objeto com enderecoEntregaId e freteId
    const response = await api.post('/api/pedidos/', orderData);
    return response.data;
  },

  /**
   * Busca pedidos do usuário autenticado
   */
  async listMyOrders(query = {}) {
    const api = (await import('./api')).default;
    const response = await api.get('/api/pedidos/', { params: query });
    return response.data;
  },

  /** Busca detalhes de um pedido pelo id */
  async getOrder(id) {
    const api = (await import('./api')).default;
    const response = await api.get(`/api/pedidos/${id}`);
    return response.data;
  },

  /** Alias para compatibilidade com componentes antigos */
  async getOrderById(id) {
    return await this.getOrder(id);
  },

  /** Busca downloads do usuário */
  async getMyDownloads() {
    const api = (await import('./api')).default;
    const response = await api.get('/api/download/meus-downloads');
    return response.data;
  },

  /** Cancela um pedido pelo id */
  async cancelOrder(id) {
    const api = (await import('./api')).default;
    const response = await api.delete(`/api/pedidos/${id}`);
    return response.data;
  }
}; 