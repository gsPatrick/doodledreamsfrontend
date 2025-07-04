import api from './api';

const authService = {
  async login(email, senha) {
    const response = await api.post('/api/auth/login', {
      email,
      senha,
    });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      api.defaults.headers.Authorization = `Bearer ${response.data.token}`;
    }
    return response.data;
  },

  async register(userData) {
    const response = await api.post('/api/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      api.defaults.headers.Authorization = `Bearer ${response.data.token}`;
    }
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    delete api.defaults.headers.Authorization;
  },

  async forgotPassword(email) {
    return api.post('/api/auth/recuperar-senha', { email });
  },

  async resetPassword(token, novaSenha) {
    return api.post('/api/auth/alterar-senha', { token, novaSenha });
  },

  async changePassword(senhaAtual, novaSenha) {
    return api.put('/api/usuarios/perfil/alterar-senha', {
      senhaAtual,
      novaSenha
    });
  },

  async loginWithGoogle(token) {
    const response = await api.post('/api/auth/google', { googleToken: token });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      api.defaults.headers.Authorization = `Bearer ${response.data.token}`;
    }
    return response.data;
  },

  async criarContaGhost(nome, email) {
    const response = await api.post('/api/auth/ghost', {
      nome,
      email,
    });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      api.defaults.headers.Authorization = `Bearer ${response.data.token}`;
    }
    return response.data;
  }
};

export default authService; 