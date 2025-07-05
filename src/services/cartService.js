import api from './api';
import { v4 as uuidv4 } from 'uuid'; // Precisamos de uma lib para gerar UUIDs. Instale com: npm install uuid

const ANONYMOUS_SESSION_KEY = 'anonymous_session_id';

// Função para obter ou criar o ID da sessão do convidado
function getSessionId() {
  let sessionId = localStorage.getItem(ANONYMOUS_SESSION_KEY);
  if (!sessionId) {
    sessionId = uuidv4();
    localStorage.setItem(ANONYMOUS_SESSION_KEY, sessionId);
  }
  return sessionId;
}

const cartService = {
  getCart() {
    const params = { sessionId: getSessionId() };
    return api.get('/api/carrinho', { params });
  },

  addToCart(produtoId, quantidade, variacaoId) {
    const payload = {
      produtoId,
      quantidade,
      variacaoId,
      sessionId: getSessionId(),
    };
    return api.post('/api/carrinho/adicionar', payload);
  },

  updateItem(produtoId, quantidade, variacaoId) {
    const payload = {
      itens: [{ produtoId, quantidade, variacaoId }],
      sessionId: getSessionId(),
    };
    return api.put('/api/carrinho/atualizar', payload);
  },
  
  // Função para atualizar múltiplos itens de uma vez
  updateMultipleItems(items) {
    const payload = {
      itens: items, // O backend espera um array em 'itens'
      sessionId: getSessionId(),
    };
    return api.put('/api/carrinho/atualizar', payload);
  },

  removeItem(produtoId, variacaoId) {
    const payload = { 
      produtoId, 
      variacaoId, 
      sessionId: getSessionId() 
    };
    // O backend espera o body no método DELETE, então a sintaxe é essa:
    return api.delete('/api/carrinho/remover', { data: payload });
  },

  clearCart() {
    const payload = { sessionId: getSessionId() };
    return api.delete('/api/carrinho/limpar', { data: payload });
  },

  // NOVA FUNÇÃO DE MIGRAÇÃO
  async migrateCart() {
    const sessionId = localStorage.getItem(ANONYMOUS_SESSION_KEY);
    if (!sessionId) {
      return; // Nada a migrar
    }
    // Esta rota requer autenticação, então o token será enviado automaticamente pelo interceptor
    const response = await api.post('/api/carrinho/migrar', { sessionId });
    
    // Após migrar com sucesso, podemos remover o ID da sessão local
    localStorage.removeItem(ANONYMOUS_SESSION_KEY);

    return response.data;
  },

  // Aliases para compatibilidade
  async updateQuantity(produtoId, variacaoId, quantidade) {
    return this.updateItem(produtoId, quantidade, variacaoId);
  },

  async removeFromCart(produtoId, variacaoId) {
    return this.removeItem(produtoId, variacaoId);
  }
};

export default cartService;