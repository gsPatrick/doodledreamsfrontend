import { ref } from 'vue';
import { useAuth } from './useAuth';
import { useNotifications } from './useNotifications';

// O estado deve ser global (singleton) para que todos os componentes compartilhem o mesmo modal.
// Por isso, declaramos fora da função do hook.
const showModal = ref(false);
const pendingAction = ref(null);

export function useGhostSignup() {
  const { addNotification } = useNotifications();
  const { updateUserState } = useAuth(); // Obtemos a função para atualizar o estado global

  const openGhostSignup = (action) => {
    console.log('Abrindo modal de Ghost Signup...');
    pendingAction.value = action; // Armazena a ação a ser executada
    showModal.value = true;
  };

  const closeGhostSignup = () => {
    showModal.value = false;
    pendingAction.value = null; // Limpa a ação ao fechar
  };

  // Esta função é chamada pelo componente do modal após o cadastro
  const handleGhostSignupSuccess = async (authResponse) => {
    if (authResponse && authResponse.token && authResponse.usuario) {
      // Atualiza o estado global de autenticação
      updateUserState(authResponse.usuario, authResponse.token);

      // Executa a ação pendente, se houver
      if (pendingAction.value && typeof pendingAction.value === 'function') {
        console.log('Executando ação pendente após cadastro fantasma...');
        await pendingAction.value();
      }

      addNotification({
        message: 'Conta criada! Enviamos um email para você definir sua senha.',
        type: 'success',
        timeout: 7000,
      });
    } else {
      addNotification({
        message: 'Ocorreu um erro ao criar sua conta. Tente novamente.',
        type: 'error',
      });
    }
    // Fecha o modal independentemente do resultado
    closeGhostSignup();
  };

  // Retorna as propriedades e métodos para serem usados pelos componentes
  return {
    showModal,
    openGhostSignup,
    closeGhostSignup,
    handleGhostSignupSuccess,
  };
}