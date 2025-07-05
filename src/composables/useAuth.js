import { ref, computed } from 'vue';
import api from '@/services/api';
import authService from '@/services/authService';

// --- ESTADO GLOBAL REATIVO ---
const user = ref(null);
const token = ref(localStorage.getItem('token') || null);
const isLoggedIn = computed(() => !!user.value);
const isAuthInitialized = ref(false);

const checkAuthStatus = async () => {
    if (isAuthInitialized.value) return;

    const localToken = localStorage.getItem('token');
    token.value = localToken; // Sincroniza o ref
    
    console.log(`[Auth] Iniciando verificação. Token: ${localToken ? 'Sim' : 'Não'}`);

    if (localToken) {
        try {
            // A própria requisição já terá o token pelo interceptor
            const response = await api.get('/api/usuarios/perfil');
            user.value = response.data;
            console.log("[Auth] Token validado. Usuário:", user.value?.nome);
        } catch (error) {
            console.error("[Auth] Falha na validação do token.", error.response?.status);
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                localStorage.removeItem('token');
                token.value = null;
                user.value = null;
            }
        }
    }
    
    isAuthInitialized.value = true;
    console.log(`[Auth] Verificação concluída. Logado: ${isLoggedIn.value}`);
};


export function useAuth() {

  const updateUserState = (newUser, newToken) => {
    user.value = newUser;
    token.value = newToken;
    if (newToken) {
      localStorage.setItem('token', newToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    } else {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    }
  };

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials.email, credentials.senha);
      if (response && response.token && response.usuario) {
        updateUserState(response.usuario, response.token);
      } else {
        throw new Error("Resposta de login inválida.");
      }
    } catch (error) {
      updateUserState(null, null);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    updateUserState(null, null);
    // Usar o router para navegar é mais limpo que recarregar a página
    window.location.href = '/login';
  };
  
  return {
    user: computed(() => user.value), // Sempre retorna um computed para segurança
    token: computed(() => token.value),
    isLoggedIn,
    isAuthInitialized,
    login,
    logout,
    checkAuthStatus,
    updateUserState,
  };
}