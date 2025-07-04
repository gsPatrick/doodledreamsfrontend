<template>
  <div v-if="showModal" class="modal-overlay">
    <div class="modal">
      <div class="modal-header">
        <h2>Cadastro Rápido</h2>
        <button class="close-button" @click="fecharModal">
          <font-awesome-icon icon="times" />
        </button>
      </div>

      <div class="modal-body">
        <p style="color: gray !important;">Para continuar, informe seus dados abaixo:</p>
        
        <div class="form-group">
          <label for="nome">Nome</label>
          <input 
            type="text" 
            id="nome" 
            v-model="formData.nome" 
            placeholder="Seu nome"
            class="form-control"
            required
          />
        </div>

        <div class="form-group">
          <label for="email">E-mail</label>
          <input 
            type="email" 
            id="email" 
            v-model="formData.email" 
            placeholder="seu@email.com"
            class="form-control"
            required
          /> 
        </div>

        <div class="error-message" v-if="errorMessage">
          {{ errorMessage }}
        </div>
        
        <div class="modal-actions">
          <button 
            class="submit-button" 
            @click="criarConta"
            :disabled="isLoading"
          >
            <span v-if="isLoading">Processando...</span>
            <span v-else>Continuar</span>
          </button>
          
          <div class="login-link">
            Já tem uma conta? 
            <router-link 
              to="/login" 
              @click="fecharModal"
            >
              Faça login
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useGhostSignup } from '../../composables/useGhostSignup';
import authService from '../../services/authService';
import { useAuth } from '../../composables/useAuth';

export default {
  name: 'GhostSignupModal',

  setup() {
    const { showModal, closeGhostSignup, handleGhostSignupSuccess } = useGhostSignup();
    const { setUser } = useAuth();
    
    const formData = ref({
      nome: '',
      email: ''
    });
    
    const isLoading = ref(false);
    const errorMessage = ref('');

    const fecharModal = () => {
      closeGhostSignup();
      formData.value = { nome: '', email: '' };
      errorMessage.value = '';
    };

    const criarConta = async () => {
      if (!formData.value.nome || !formData.value.email) {
        errorMessage.value = 'Por favor, preencha todos os campos';
        return;
      }
      
      try {
        isLoading.value = true;
        errorMessage.value = '';
        
        const resultado = await authService.criarContaGhost(
          formData.value.nome,
          formData.value.email
        );
        
        // Atualiza usuário no estado
        setUser(resultado.usuario);
        
        // Notifica sucesso e executa ação pendente
        await handleGhostSignupSuccess(resultado);
        
      } catch (error) {
        console.error('Erro ao criar conta:', error);
        errorMessage.value = error.response?.data?.erro || 'Erro ao criar conta. Tente novamente.';
      } finally {
        isLoading.value = false;
      }
    };

    return {
      showModal,
      formData,
      isLoading,
      errorMessage,
      fecharModal,
      criarConta
    };
  }
}
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: space-between;

  h2 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
  }
}

.close-button {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
  font-size: 1.25rem;
  transition: color 0.2s;

  &:hover {
    color: #333;
  }
}

.modal-body {
  padding: 1.5rem;

  p {
    margin: 0 0 1.5rem;
    color: #666;
    text-align: center;
  }
}

.form-group {
  margin-bottom: 1rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }
  
  .form-control {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    
    &:focus {
      outline: none;
      border-color: #666;
    }
  }
}

.error-message {
  color: #e74c3c;
  margin: 1rem 0;
  text-align: center;
  font-size: 0.875rem;
}

.modal-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.submit-button {
  padding: 0.75rem;
  border-radius: 4px;
  background: $primary;
  color: white;
  font-weight: 500;
  border: none;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  transition: all 0.2s;
  
  &:hover {
    background: var(--color-primary-dark, #388E3C);
  }
  
  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }
}

.login-link {
  text-align: center;
  font-size: 0.875rem;
  color: #666;
  
  a {
    color: $primary;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
}
</style> 