import { ref } from 'vue';
import { useAuth } from './useAuth';
import { useNotifications } from './useNotifications';

const showModal = ref(false);
const pendingAction = ref(null);

export function useGhostSignup() {
  const { addNotification } = useNotifications();
  const { updateUserState } = useAuth();

  const openGhostSignup = (action) => {
    pendingAction.value = action;
    showModal.value = true;
  };

  const closeGhostSignup = () => {
    showModal.value = false;
    pendingAction.value = null;
  };

  const handleGhostSignupSuccess = async (authResponse) => {
    if (authResponse && authResponse.token && authResponse.usuario) {
      updateUserState(authResponse.usuario, authResponse.token);

      if (pendingAction.value && typeof pendingAction.value === 'function') {
        await pendingAction.value();
      }
      addNotification({ message: 'Conta criada com sucesso!', type: 'success' });
    } else {
      addNotification({ message: 'Erro ao criar conta.', type: 'error' });
    }
    closeGhostSignup();
  };

  return {
    showModal,
    openGhostSignup,
    closeGhostSignup,
    handleGhostSignupSuccess,
  };
}