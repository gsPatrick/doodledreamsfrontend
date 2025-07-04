import { ref } from 'vue'

import { useAuth } from './useAuth'
import authService from '../services/authService'
import { useNotifications } from './useNotifications'

export function useGhostSignup() {
  const showModal = ref(false)

  const { addNotification } = useNotifications()
  const { checkAuthStatus } = useAuth()
  const pendingAction = ref(null)

  const openGhostSignup = (action) => {
    console.log('openGhostSignup chamado, abrindo modal...')
    pendingAction.value = action
    showModal.value = true
    console.log('Estado do showModal:', showModal.value)
  }

  const closeGhostSignup = () => {
    console.log('closeGhostSignup chamado, fechando modal...')
    showModal.value = false
    pendingAction.value = null
    console.log('Estado do showModal:', showModal.value)
  }

  const handleGhostSignupSuccess = async (resultado) => {
    await checkAuthStatus()
    
    if (pendingAction.value) {
      console.log('Executando ação pendente após cadastro...')
      // Executa a ação que estava pendente
      await pendingAction.value()
      pendingAction.value = null
    }
    
    addNotification({
      message: 'Conta criada com sucesso! Enviamos um email para você definir sua senha.',
      type: 'success'
    })
    closeGhostSignup()
  }

  return {
    showModal,
    openGhostSignup,
    closeGhostSignup,
    handleGhostSignupSuccess
  }
} 