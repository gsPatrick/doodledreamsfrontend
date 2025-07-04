import api from './api';

const paymentService = {
  /**
   * Inicia o fluxo de pagamento para um pedido e retorna os dados (por exemplo link, QRCode…)
   * @param {number|string} pedidoId
   */
  async checkout(pedidoId) {
    const { data } = await api.post('/api/pagamentos/checkout', { pedidoId });
    return data;
  },

  /** Consulta status do pagamento */
  async status(pedidoId) {
    const { data } = await api.get(`/api/pagamentos/status/${pedidoId}`);
    return data;
  }
};

export default paymentService; 