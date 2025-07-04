import api from './api';

const cartService = {
  /**
   * Busca o carrinho do usuário.
   */
  async getCart() {
    const response = await api.get('/api/carrinho');
    return response.data;
  },

  /**
   * Adiciona um produto ao carrinho.
   * @param {string|number} produtoId - O ID do produto.
   * @param {number} quantidade - A quantidade a ser adicionada.
   * @param {string|number} variacaoId - O ID da variação selecionada.
   */
  async addToCart(produtoId, quantidade, variacaoId) {
    const payload = { produtoId, quantidade };
    if (variacaoId !== undefined && variacaoId !== null) {
      payload.variacaoId = variacaoId;
    }
    const response = await api.post('/api/carrinho/adicionar', payload);
    return response.data;
  },

  /**
   * Atualiza a quantidade de um item no carrinho.
   * @param {string|number} produtoId - O ID do produto.
   * @param {number} quantidade - A nova quantidade.
   * @param {string|number} variacaoId - O ID da variação selecionada.
   */
  async updateItem(produtoId, quantidade, variacaoId) {
    const item = { produtoId, quantidade };
    if (variacaoId !== undefined && variacaoId !== null) {
      item.variacaoId = variacaoId;
    }
    const response = await api.put('/api/carrinho/atualizar', { itens: [item] });
    return response.data;
  },

  /**
   * Remove um item do carrinho.
   * @param {string|number} produtoId - O ID do produto a ser removido.
   * @param {string|number} variacaoId - O ID da variação selecionada.
   */
  async removeItem(produtoId, variacaoId) {
    const payload = { produtoId };
    if (variacaoId !== undefined && variacaoId !== null) {
      payload.variacaoId = variacaoId;
    }
    // Usando POST com método personalizado para garantir que o corpo seja enviado corretamente
    const response = await api({
      method: 'DELETE',
      url: '/api/carrinho/remover',
      data: payload
    });
    return response.data;
  },

  /**
   * Limpa todos os itens do carrinho.
   */
  async clearCart() {
    const response = await api.delete('/api/carrinho/limpar');
    return response.data;
  },

  // Aliases para compatibilidade com componentes existentes
  async updateQuantity(produtoId, variacaoId, quantidade) {
    return this.updateItem(produtoId, quantidade, variacaoId);
  },

  async removeFromCart(produtoId, variacaoId) {
    return this.removeItem(produtoId, variacaoId);
  }
};

export default cartService; 