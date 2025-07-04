import api from './api';

const addressService = {
  /** Busca todos os endereços do usuário */
  async getAddresses() {
    const response = await api.get('/api/enderecos');
    return response.data;
  },
  
  /** Busca dados de CEP */
  async getCep(cep) {
    // Remover traços e pontos do CEP
    const cleanedCep = cep.replace(/[^0-9]/g, '');
    const response = await api.get(`https://viacep.com.br/ws/${cleanedCep}/json/`);
    return response.data;
  },

  /** Cria um novo endereço */
  async createAddress(addressData) {
    const response = await api.post('/api/enderecos', addressData);
    return response.data;
  },

  /** Atualiza um endereço existente */
  async updateAddress(id, addressData) {
    const response = await api.put(`/api/enderecos/${id}`, addressData);
    return response.data;
  },

  /** Deleta um endereço */
  async deleteAddress(id) {
    const response = await api.delete(`/api/enderecos/${id}`);
    return response.data;
  },

  /** Define um endereço como principal */
  async setPrincipal(id) {
    const response = await api.post(`/api/enderecos/${id}/principal`);
    return response.data;
  }
};

export default addressService; 