import { ref, computed } from 'vue';
import api from '@/services/api';
import authService from '@/services/authService';

// --- ESTADO GLOBAL REATIVO ---
// Definido fora da função para ser um singleton, compartilhado por toda a app.
const user = ref(null);
const token = ref(localStorage.getItem('token'));
const isLoggedIn = computed(() => !!user.value);

// Flag para controlar se a verificação inicial de autenticação já foi concluída.
const isAuthInitialized = ref(false);

// --- FUNÇÃO DE VERIFICAÇÃO DE STATUS (CHAMADA UMA VEZ) ---
const checkAuthStatus = async () => {
  // Previne múltiplas execuções
  if (isAuthInitialized.value) return;

  const localToken = localStorage.getItem('token');
  console.log(`[Auth] Iniciando verificação. Token no localStorage: ${localToken ? 'Sim' : 'Não'}`);

  if (localToken) {
    token.value = localToken;
    try {
      // Tenta buscar o perfil do usuário para validar o token existente.
      const response = await api.get('/api/usuarios/perfil');
      user.value = response.data;
      console.log("[Auth] Token validado com sucesso. Usuário definido:", user.value.nome);
    } catch (error) {
      console.error("[Auth] Falha na validação do token. Limpando token inválido.", error);
      localStorage.removeItem('token');
      user.value = null;
      token.value = null;
    }
  }
  
  // Marca a inicialização como concluída, independentemente do resultado.
  isAuthInitialized.value = true;
  console.log(`[Auth] Verificação de autenticação concluída. Usuário logado: ${isLoggedIn.value}`);
};

// --- HOOK PRINCIPAL ---
export function useAuth() {

  // Função para realizar o login do usuário
  const login = async (credentials) => {
    try {
      console.log("[Auth] Tentando fazer login para:", credentials.email);
      const response = await authService.login(credentials.email, credentials.senha);
      
      if (response && response.token && response.usuario) {
        const { token: newToken, usuario } = response;
        
        // Ponto crítico: Salva o token no localStorage
        localStorage.setItem('token', newToken);
        
        // Atualiza o estado reativo global
        token.value = newToken;
        user.value = usuario;
        
        // Define o cabeçalho padrão do Axios para garantir que futuras requisições o incluam
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        
        console.log(`[Auth] Login bem-sucedido para ${usuario.nome}. Token salvo no localStorage.`);
      } else {
        throw new Error("Resposta de login inválida recebida da API.");
      }
    } catch (error) {
      console.error("[Auth] Erro no fluxo de login:", error.response?.data?.erro || error.message);
      // Garante que tudo seja limpo em caso de falha no login
      localStorage.removeItem('token');
      token.value = null;
      user.value = null;
      delete api.defaults.headers.common['Authorization'];
      throw error; // Re-lança o erro para o componente de UI tratar (ex: mostrar mensagem)
    }
  };

  // Função para realizar o logout do usuário
  const logout = () => {
    console.log("[Auth] Realizando logout.");
    authService.logout(); // O serviço já limpa o localStorage e o header da api
    user.value = null;
    token.value = null;
    // Redirecionamento forçado para garantir que todos os estados sejam resetados.
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
  };
}