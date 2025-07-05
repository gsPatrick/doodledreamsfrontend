import { ref } from 'vue';
import { useAuth } from './useAuth';
import authService from '../services/authService';
import { useNotifications } from './useNotifications';

// Estado global para o modal, para que apenas uma instância exista.
const showModal = ref(false);
const pendingAction = ref(null);

export function useGhostSignup() {
  const { addNotification } = useNotifications();
  const { checkAuthStatus } = useAuth(); // Usado para atualizar o estado de login
  
  const openGhostSignup = (action) => {
    console.log('Abrindo modal de Ghost Signup...');
    pendingAction.value = action; // Armazena a ação (ex: adicionar ao carrinho)
    showModal.value = true;
  };

  const closeGhostSignup = () => {
    showModal.value = false;
    pendingAction.value = null;
  };

  // Esta função será chamada pelo componente do modal quando o usuário se cadastrar
  const handleGhostSignupSuccess = async () => {
    // Atualiza o estado de autenticação em toda a aplicação
    await checkAuthStatus();
    
    // Se havia uma ação pendente, execute-a agora que o usuário está "logado"
    if (pendingAction.value && typeof pendingAction.value === 'function') {
      console.log('Executando ação pendente após cadastro fantasma...');
      await pendingAction.value();
    }
    
    addNotification({
      message: 'Conta criada! Enviamos um email para você definir sua senha.',
      type: 'success'
    });
    closeGhostSignup();
  };

  return {
    showModal,
    pendingAction,
    openGhostSignup,
    closeGhostSignup,
    handleGhostSignupSuccess,
  };
}