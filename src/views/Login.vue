<template>
  <div class="login-page">
    <div class="container">
    

      <div class="login-container">
        <div class="login-card">
          <h2>Login</h2>

          <form @submit.prevent="handleSubmit">
            <!-- Mensagem de erro -->
            <div v-if="error" class="error-message">
              <font-awesome-icon icon="exclamation-circle" />
              Email ou senha incorretos
            </div>

            <!-- Email -->
            <div class="form-group">
              <label for="email">Email</label>
              <div class="input-group">
                <font-awesome-icon icon="envelope" />
                <input id="email" v-model="email" type="email" required placeholder="Seu email" />
              </div>
            </div>

            <!-- Senha -->
            <div class="form-group">
              <label for="senha">Senha</label>
              <div class="input-group">
                <font-awesome-icon icon="lock" />
                <input
                  id="senha"
                  v-model="senha"
                  :type="mostrarSenha ? 'text' : 'password'"
                  required
                  placeholder="Sua senha"
                />
                <button type="button" class="toggle-password" @click="mostrarSenha = !mostrarSenha">
                  <font-awesome-icon :icon="mostrarSenha ? 'eye-slash' : 'eye'" />
                </button>
              </div>
            </div>

            <!-- Link recuperar senha -->
            <div class="forgot-password">
              <router-link to="/recuperar-senha">Esqueceu sua senha?</router-link>
            </div>

            <!-- Botão de login -->
            <button type="submit" class="btn-login" :disabled="isLoading">
              <span v-if="isLoading">
                <font-awesome-icon icon="spinner" spin />
                Entrando...
              </span>
              <span v-else> Entrar </span>
            </button>

       
      

            <!-- Link para registro -->
            <div class="register-link">
              Não tem uma conta?
              <router-link to="/cadastro">Cadastre-se</router-link>
            </div>
          </form>
        </div>
      </div>
    </div>

    <GhostSignupModal
      :show="showModal"
      @close="closeGhostSignup"
      @success="handleGhostSignupSuccess"
    />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import authService from '../services/authService'
import { useGhostSignup } from '../composables/useGhostSignup'
import GhostSignupModal from '../components/modals/GhostSignupModal.vue'

export default {
  name: 'Login',

  components: {
    GhostSignupModal
  },

  setup() {
    const router = useRouter()
    const route = useRoute()
    const { showModal, openGhostSignup, closeGhostSignup, handleGhostSignupSuccess } = useGhostSignup()

    const email = ref('')
    const senha = ref('')
    const mostrarSenha = ref(false)
    const isLoading = ref(false)
    const error = ref(null)

    onMounted(() => {
      // Se veio da rota que requer autenticação e tem o parâmetro ghost,
      // abre o modal de cadastro ghost automaticamente
      if (route.query.ghost === 'true') {
        openGhostSignup()
      }
    })

    const handleSubmit = async () => {
      try {
        isLoading.value = true
        error.value = null
        
        const resultado = await authService.login(email.value, senha.value)
        
        // Redireciona para a página que o usuário tentou acessar originalmente
        const redirectTo = route.query.redirect || '/'
        router.push(redirectTo)
      } catch (err) {
        if (err.response?.data?.erro) {
          error.value = err.response.data.erro
        } else {
          error.value = 'Ocorreu um erro durante o login. Tente novamente.'
        }
      } finally {
        isLoading.value = false
      }
    }

    const loginWithGoogle = async () => {
      try {
        // Implementar lógica do Google Sign-In
        console.log('Login com Google')
      } catch (error) {
        console.error('Erro no login com Google:', error)
      }
    }

    return {
      email,
      senha,
      mostrarSenha,
      isLoading,
      error,
      handleSubmit,
      loginWithGoogle,
      showModal,
      closeGhostSignup,
      handleGhostSignupSuccess
    }
  },
}
</script>

<style lang="scss">
@use 'sass:color';

.login-page {
  padding: $spacing-xl 0;
}

.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #f8f9fa;
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  h2 {
    text-align: center;
    margin-bottom: 30px;
    color: #2c3e50;
  }
}

.form-group {
  margin-bottom: 20px;

  label {
    display: block;
    margin-bottom: 8px;
    color: #2c3e50;
    font-weight: 500;
  }
}

.input-group {
  position: relative;
  display: flex;
  align-items: center;

  .fa-envelope,
  .fa-lock {
    position: absolute;
    left: 12px;
    color: #666;
  }

  input {
    width: 100%;
    padding: 12px 40px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
    transition: border-color 0.2s;

    &:focus {
      outline: none;
      border-color: #42b983;
    }
  }

  .toggle-password {
    position: absolute;
    right: 12px;
    background: none;
    border: none;
    color: #666;
    cursor: pointer;
    padding: 0;

    &:hover {
      color: #42b983;
    }
  }
}

.error-message {
  background-color: #fde8e8;
  color: #dc3545;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.forgot-password {
  text-align: right;
  margin-bottom: 20px;

  a {
    color: #42b983;
    text-decoration: none;
    font-size: 14px;

    &:hover {
      text-decoration: underline;
    }
  }
}

.btn-login {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;

  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: background-color 0.2s;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
}

.btn-login {
  background: $primary;
  color: white;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    color: gray !important;
    transition: all 0.2s;
    background: $primary !important;
  }
}

.btn-google {
  background-color: white;
  color: #666;
  border: 1px solid #ddd;
  margin-bottom: 20px;

  &:hover:not(:disabled) {
    background-color: #f8f9fa;
  }
}

.divider {
  text-align: center;
  margin: 20px 0;
  position: relative;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 45%;
    height: 1px;
    background-color: #ddd;
  }

  &::before {
    left: 0;
  }

  &::after {
    right: 0;
  }

  span {
    background-color: white;
    padding: 0 10px;
    color: #666;
    font-size: 14px;
  }
}

.register-link {
  text-align: center;
  margin-top: 20px;
  color: #666;
  font-size: 14px;

  a {
    color: #42b983;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
