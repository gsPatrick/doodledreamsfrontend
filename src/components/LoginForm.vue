<template>
  <div class="login-form">
    <h2 class="form-title">Login</h2>
    
    <form @submit.prevent="login">
      <div class="form-group">
        <label for="email" class="form-label">E-mail</label>
        <input 
          type="email" 
          id="email" 
          v-model="email" 
          class="form-control" 
          placeholder="Seu e-mail"
          required
        >
      </div>
      
      <div class="form-group">
        <label for="password" class="form-label">Senha</label>
        <div class="password-input-wrapper">
          <input 
            :type="showPassword ? 'text' : 'password'" 
            id="password" 
            v-model="password" 
            class="form-control" 
            placeholder="Sua senha"
            required
          >
          <button 
            type="button" 
            class="password-toggle" 
            @click="togglePasswordVisibility"
          >
            <font-awesome-icon :icon="showPassword ? 'eye-slash' : 'eye'" />
          </button>
        </div>
      </div>
      
      <div class="form-options">
        <div class="remember-me">
          <input type="checkbox" id="remember" v-model="rememberMe">
          <label for="remember">Lembrar-me</label>
        </div>
        <a href="#" class="forgot-password">Esqueceu a senha?</a>
      </div>
      
      <div class="form-error" v-if="error">
        {{ error }}
      </div>
      
      <button type="submit" class="btn btn-primary btn-block" :disabled="isLoading">
        <span v-if="isLoading">
          <font-awesome-icon icon="spinner" spin /> Entrando...
        </span>
        <span v-else>Entrar</span>
      </button>
      
  
      
      <div class="register-link">
        Não tem uma conta? <router-link to="/cadastro">Cadastre-se</router-link>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'LoginForm',
  data() {
    return {
      email: '',
      password: '',
      rememberMe: false,
      showPassword: false,
      isLoading: false,
      error: null
    }
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword
    },
    login() {
      this.isLoading = true
      this.error = null
      
      // Simulação de login
      setTimeout(() => {
        // Verificação básica
        if (this.email === 'teste@exemplo.com' && this.password === 'senha123') {
          // Login bem-sucedido
          this.$emit('login-success', { email: this.email })
          this.$router.push('/')
        } else {
          // Login falhou
          this.error = 'E-mail ou senha incorretos. Por favor, tente novamente.'
        }
        
        this.isLoading = false
      }, 1500)
    }
  }
}
</script>

<style lang="scss">
@use 'sass:color';

.login-form {
  max-width: 400px;
  margin: 0 auto;
  padding: $spacing-xl;
  background-color: #ffffff;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-md;
}

.form-title {
  font-size: $font-size-2xl;
  margin-bottom: $spacing-xl;
  text-align: center;
  color: #2d3748;;
  
  &::after {
    content: '';
    display: block;
    width: 60px;
    height: 3px;
    background-color: $primary;
    margin: $spacing-sm auto 0;
    border-radius: $border-radius-full;
  }
}

.password-input-wrapper {
  position: relative;
  
  .password-toggle {
    position: absolute;
    right: $spacing-sm;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: color.adjust(#2d3748, $lightness: 30%);
    cursor: pointer;
    
    &:hover {
      color: $primary;
    }
  }
}

.form-options {
  @include flex(row, space-between, center);
  margin-bottom: $spacing-md;
  font-size: $font-size-sm;
}

.remember-me {
  @include flex(row, flex-start, center);
  
  input[type="checkbox"] {
    margin-right: $spacing-xs;
  }
}

.forgot-password {
  color: $primary;
  
  &:hover {
    text-decoration: underline;
  }
}

.form-error {
  background-color: rgba(#ff5252, 0.1);
  color: #ff5252;
  padding: $spacing-sm;
  border-radius: $border-radius-md;
  margin-bottom: $spacing-md;
  font-size: $font-size-sm;
  text-align: center;
}

.btn-block {
  width: 100%;
  margin-bottom: $spacing-lg;
}
.btn{
  background: $primary;
  color: white;
  &:hover{
    background: var(--color-primary-dark, #388E3C);
  }
}
.social-login {
  margin-bottom: $spacing-lg;
  text-align: center;
}

.social-login-text {
  position: relative;
  font-size: $font-size-sm;
  color: color.adjust(#2d3748, $lightness: 30%);
  margin-bottom: $spacing-md;
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 30%;
    height: 1px;
    background-color: color.adjust(#2d3748, $lightness: 70%);
  }
  
  &::before {
    left: 0;
  }
  
  &::after {
    right: 0;
  }
}

.social-buttons {
  @include flex(row, center, center);
}

.social-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin: 0 $spacing-xs;
  @include flex(row, center, center);
  transition: $transition-base;
  
  &.facebook {
    background-color: color.adjust(#3b5998, $lightness: -10%);
    color: #ffffff;
    
    &:hover {
      background-color: color.adjust(#3b5998, $lightness: -20%);
      transform: translateY(-2px);
    }
  }
  
  &.google {
    background-color: color.adjust(#db4437, $lightness: -10%);
    color: #ffffff;
    
    &:hover {
      background-color: color.adjust(#db4437, $lightness: -20%);
      transform: translateY(-2px);
    }
  }
}

.register-link {
  text-align: center;
  font-size: $font-size-sm;
  
  a {
    color: $primary;
    font-weight: 600;
    
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>

