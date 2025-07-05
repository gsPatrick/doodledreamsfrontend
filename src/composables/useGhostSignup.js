import { ref, computed } from 'vue';
import api from '@/services/api';
import authService from '@/services/authService';

// --- ESTADO GLOBAL REATIVO ---
const user = ref(null);
const token = ref(localStorage.getItem('token'));
const isLoggedIn = computed(() => !!user.value);
const isAuthInitialized = ref(false);

// --- FUNÇÃO DE VERIFICAÇÃO DE STATUS (CHAMADA UMA VEZ) ---
const checkAuthStatus = async () => {
    // ... (código existente de checkAuthStatus permanece o mesmo) ...
    if (isAuthInitialized.value) return;

    const localToken = localStorage.getItem('token');
    console.log(`[Auth] Iniciando verificação. Token no localStorage: ${localToken ? 'Sim' : 'Não'}`);

    if (localToken) {
        token.value = localToken;
        try {
            const response = await api.get('/api/usuarios/perfil');
            user.value = response.data;
            console.log("[Auth] Token validado com sucesso. Usuário definido:", user.value.nome);
        } catch (error) {
            console.error("[Auth] Falha na validação do token.", error);
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                console.warn("[Auth] Erro de autenticação (401/403). Limpando token inválido.");
                localStorage.removeItem('token');
                user.value = null;
                token.value = null;
            } else {
                console.error("[Auth] Erro de servidor ou rede. O token NÃO será removido.");
            }
        }
    }
    
    isAuthInitialized.value = true;
    console.log(`[Auth] Verificação de autenticação concluída. Usuário logado: ${isLoggedIn.value}`);
};

// --- HOOK PRINCIPAL ---
export function useAuth() {

  // --- NOVA FUNÇÃO PARA ATUALIZAÇÃO DE ESTADO CONTROLADA ---
  const updateUserState = (newUser, newToken) => {
    user.value = newUser;
    token.value = newToken;
    if(newToken) {
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
        // Usa a nova função para centralizar a lógica de atualização de estado
        updateUserState(response.usuario, response.token);
        console.log(`[Auth] Login bem-sucedido para ${response.usuario.nome}.`);
      } else {
        throw new Error("Resposta de login inválida recebida da API.");
      }
    } catch (error) {
      console.error("[Auth] Erro no fluxo de login:", error.response?.data?.erro || error.message);
      updateUserState(null, null); // Limpa o estado em caso de falha
      throw error;
    }
  };

  const logout = () => {
    console.log("[Auth] Realizando logout.");
    authService.logout(); // O serviço já limpa o localStorage
    updateUserState(null, null); // Limpa o estado reativo
    window.location.href = '/login';
  };
  
  // Retorna as propriedades e métodos que os componentes podem usar
  return {
    user,
    token,
    isLoggedIn,
    isAuthInitialized,
    login,
    logout,
    checkAuthStatus,
    updateUserState, // <-- Exporta a nova função
  };
}