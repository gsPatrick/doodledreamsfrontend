import api from './api';

const freteService = {
  /**
   * Calcula o frete com base no endereço de destino e itens.
   * @param {object} data - Contém enderecoDestino e itens.
   * @returns {Promise<object>} Opções de frete.
   */
  async calcularFrete(data) {
    const response = await api.post('/api/frete/calcular', data);
    return response.data;
  },
};

export default freteService; 