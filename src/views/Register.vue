<template>
  <div class="register-page">
    <div class="container">
      <div class="breadcrumb">
        <router-link to="/" class="breadcrumb-item">Home</router-link>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-item active"> Cadastro</span>
      </div>

      <div class="register-container">
        <div class="register-card">
          <h2>Cadastro</h2>

          <form @submit.prevent="handleSubmit">
            <!-- Mensagem de erro -->
            <div v-if="error" class="error-message">
              <font-awesome-icon icon="exclamation-circle" />
              {{ error }}
            </div>

            <!-- Nome -->
            <div class="form-group">
              <label for="nome">Nome</label>
              <div class="input-group">
                <font-awesome-icon icon="user" />
                <input
                  id="nome"
                  v-model="nome"
                  type="text"
                  required
                  placeholder="Seu nome completo"
                />
              </div>
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
              <small class="password-requirements">
                A senha deve conter pelo menos 8 caracteres, incluindo letras e números
              </small>
            </div>

            <!-- Confirmar Senha -->
            <div class="form-group">
              <label for="confirmarSenha">Confirmar Senha</label>
              <div class="input-group">
                <font-awesome-icon icon="lock" />
                <input
                  id="confirmarSenha"
                  v-model="confirmarSenha"
                  :type="mostrarConfirmarSenha ? 'text' : 'password'"
                  required
                  placeholder="Confirme sua senha"
                />
                <button
                  type="button"
                  class="toggle-password"
                  @click="mostrarConfirmarSenha = !mostrarConfirmarSenha"
                >
                  <font-awesome-icon :icon="mostrarConfirmarSenha ? 'eye-slash' : 'eye'" />
                </button>
              </div>
            </div>

            <!-- Botão de registro -->
            <button type="submit" class="btn-register" :disabled="isLoading || !senhasConferem">
              <span v-if="isLoading">
                <font-awesome-icon icon="spinner" spin />
                Cadastrando...
              </span>
              <span v-else> Cadastrar </span>
            </button>

            <!-- Divisor -->
            <div class="divider">
              <span>ou</span>
            </div>

            <!-- Registro com Google -->
            <button
              type="button"
              class="btn-google"
              @click="registrarComGoogle"
              :disabled="isLoading"
            >
              <font-awesome-icon :icon="['fab', 'google']" />
              Cadastrar com Google
            </button>

            <!-- Link para login -->
            <div class="login-link">
              Já tem uma conta?
              <router-link to="/login">Faça login</router-link>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import authService from '../services/authService'

export default {
  name: 'Register',

  setup() {
    const router = useRouter()

    const nome = ref('')
    const email = ref('')
    const senha = ref('')
    const confirmarSenha = ref('')
    const mostrarSenha = ref(false)
    const mostrarConfirmarSenha = ref(false)
    const isLoading = ref(false)
    const error = ref(null)

    const senhasConferem = computed(
      () => senha.value && confirmarSenha.value && senha.value === confirmarSenha.value
    )

    const handleSubmit = async () => {
      if (!senhasConferem.value) {
        error.value = 'As senhas não conferem'
        return
      }

      isLoading.value = true
      error.value = null

      try {
        await authService.register({
          nome: nome.value,
          email: email.value,
          senha: senha.value,
        })
        // Redirecionar para home, pois o usuário já estará logado
        router.push('/')
      } catch (err) {
        if (err.response && err.response.data && err.response.data.erro) {
          error.value = err.response.data.erro
        } else {
          error.value = 'Ocorreu um erro durante o cadastro. Tente novamente.'
        }
        console.error('Erro no registro:', err)
      } finally {
        isLoading.value = false
      }
    }

    const registrarComGoogle = async () => {
      try {
        // Implementar lógica do Google Sign-In
        console.log('Registro com Google')
      } catch (error) {
        console.error('Erro no registro com Google:', error)
      }
    }

    return {
      nome,
      email,
      senha,
      confirmarSenha,
      mostrarSenha,
      mostrarConfirmarSenha,
      isLoading,
      error,
      senhasConferem,
      handleSubmit,
      registrarComGoogle,
    }
  },
}
</script>

<style lang="scss">
@use 'sass:color';

.register-page {
  padding: $spacing-xl 0;
}

.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #f8f9fa;
}

.register-card {
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

  .fa-user,
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

.password-requirements {
  display: block;
  margin-top: 8px;
  font-size: 12px;
  color: #666;
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

.btn-register,
.btn-google {
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

.btn-register {
  background-color: color.adjust(#42b983, $lightness: -10%);
  color: white;

  &:hover:not(:disabled) {
    background-color: color.adjust(#42b983, $lightness: -20%);
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

.login-link {
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
