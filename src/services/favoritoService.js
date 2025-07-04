import api from './api';

const favoritoService = {
  /**
   * Lista todos os produtos favoritos do usuário logado.
   */
  getFavoritos() {
    return api.get('/api/favoritos');
  },

  /**
   * Adiciona um produto aos favoritos.
   * @param {object} dados - Objeto contendo o ID do produto. Ex: { produtoId: 1 }
   */
  addFavorito(dados) {
    return api.post('/api/favoritos', dados);
  },

  /**
   * Remove um produto dos favoritos.
   * @param {number|string} produtoId - O ID do produto a ser removido.
   */
  removeFavorito(produtoId) {
    return api.delete(`/api/favoritos/${produtoId}`);
  },

  /**
   * Verifica se um produto já está nos favoritos.
   * @param {number|string} produtoId - O ID do produto a ser verificado.
   */
  verificarFavorito(produtoId) {
    return api.get(`/api/favoritos/verificar/${produtoId}`);
  },

  /**
   * Conta o total de produtos favoritos do usuário.
   */
  contarFavoritos() {
    return api.get('/api/favoritos/contar');
  },
};

export default favoritoService; 