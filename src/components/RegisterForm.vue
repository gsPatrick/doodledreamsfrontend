<template>
  <div class="register-form">
    <h2 class="form-title">Cadastre-se</h2>
    
    <form @submit.prevent="register">
      <div class="form-group">
        <label for="name" class="form-label">Nome completo</label>
        <input 
          type="text" 
          id="name" 
          v-model="name" 
          class="form-control" 
          placeholder="Seu nome completo"
          required
        >
      </div>
      
      <div class="form-group">
        <label for="email" class="form-label">E-mail</label>
        <input 
          type="email" 
          id="email" 
          v-model="email" 
          class="form-control" 
          placeholder="Seu melhor e-mail"
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
            placeholder="Crie uma senha segura"
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
        <div class="password-strength" v-if="password">
          <div class="strength-bar">
            <div 
              class="strength-indicator" 
              :style="{ width: `${passwordStrength.score * 25}%` }"
              :class="passwordStrength.class"
            ></div>
          </div>
          <span class="strength-text" :class="passwordStrength.class">
            {{ passwordStrength.text }}
          </span>
        </div>
      </div>
      
      <div class="form-group">
        <label for="confirmPassword" class="form-label">Confirmar senha</label>
        <div class="password-input-wrapper">
          <input 
            :type="showConfirmPassword ? 'text' : 'password'" 
            id="confirmPassword" 
            v-model="confirmPassword" 
            class="form-control" 
            placeholder="Confirme sua senha"
            required
          >
          <button 
            type="button" 
            class="password-toggle" 
            @click="toggleConfirmPasswordVisibility"
          >
            <font-awesome-icon :icon="showConfirmPassword ? 'eye-slash' : 'eye'" />
          </button>
        </div>
        <div class="password-match" v-if="password && confirmPassword">
          <span v-if="passwordsMatch" class="match-success">
            <font-awesome-icon icon="check" /> Senhas conferem
          </span>
          <span v-else class="match-error">
            <font-awesome-icon icon="times" /> Senhas não conferem
          </span>
        </div>
      </div>
      
      <div class="form-group">
        <div class="checkbox-wrapper">
          <input type="checkbox" id="terms" v-model="acceptTerms" required>
          <label for="terms">
            Eu li e concordo com os <a href="#" @click.prevent="showTerms">Termos de Uso</a> e <a href="#" @click.prevent="showPrivacy">Política de Privacidade</a>
          </label>
        </div>
      </div>
      
      <div class="form-group">
        <div class="checkbox-wrapper">
          <input type="checkbox" id="newsletter" v-model="subscribeNewsletter">
          <label for="newsletter">
            Desejo receber novidades e ofertas por e-mail
          </label>
        </div>
      </div>
      
      <div class="form-error" v-if="error">
        {{ error }}
      </div>
      
      <button 
        type="submit" 
        class="btn btn-primary btn-block" 
        :disabled="isLoading || !isFormValid"
      >
        <span v-if="isLoading">
          <font-awesome-icon icon="spinner" spin /> Cadastrando...
        </span>
        <span v-else>Criar conta</span>
      </button>
      
      <div class="login-link">
        Já tem uma conta? <router-link to="/login">Faça login</router-link>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'RegisterForm',
  data() {
    return {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
      subscribeNewsletter: true,
      showPassword: false,
      showConfirmPassword: false,
      isLoading: false,
      error: null
    }
  },
  computed: {
    passwordsMatch() {
      return this.password === this.confirmPassword && this.password !== ''
    },
    passwordStrength() {
      if (!this.password) {
        return { score: 0, text: '', class: '' }
      }
      
      let score = 0
      let text = ''
      let className = ''
      
      // Comprimento mínimo
      if (this.password.length >= 8) score++
      
      // Contém letras minúsculas
      if (/[a-z]/.test(this.password)) score++
      
      // Contém letras maiúsculas
      if (/[A-Z]/.test(this.password)) score++
      
      // Contém números
      if (/[0-9]/.test(this.password)) score++
      
      // Contém caracteres especiais
      if (/[^a-zA-Z0-9]/.test(this.password)) score++
      
      // Classificação
      if (score <= 2) {
        text = 'Fraca'
        className = 'weak'
      } else if (score <= 3) {
        text = 'Média'
        className = 'medium'
      } else if (score === 4) {
        text = 'Forte'
        className = 'strong'
      } else {
        text = 'Muito forte'
        className = 'very-strong'
      }
      
      return { score, text, class: className }
    },
    isFormValid() {
      return (
        this.name.trim() !== '' &&
        this.email.trim() !== '' &&
        this.password.trim() !== '' &&
        this.confirmPassword.trim() !== '' &&
        this.passwordsMatch &&
        this.acceptTerms
      )
    }
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword
    },
    toggleConfirmPasswordVisibility() {
      this.showConfirmPassword = !this.showConfirmPassword
    },
    showTerms() {
      alert('Termos de Uso - Em construção')
    },
    showPrivacy() {
      alert('Política de Privacidade - Em construção')
    },
    register() {
      if (!this.isFormValid) return
      
      this.isLoading = true
      this.error = null
      
      // Simulação de registro
      setTimeout(() => {
        // Verificação básica
        if (this.email === 'teste@exemplo.com') {
          // E-mail já cadastrado
          this.error = 'Este e-mail já está cadastrado. Por favor, use outro e-mail ou faça login.'
        } else {
          // Registro bem-sucedido
          this.$emit('register-success', { 
            name: this.name,
            email: this.email,
            subscribeNewsletter: this.subscribeNewsletter
          })
          
          // Redirecionar para a página de login
          this.$router.push('/login')
        }
        
        this.isLoading = false
      }, 1500)
    }
  }
}
</script>

<style lang="scss">
@use 'sass:color';

.register-form {
  max-width: 500px;
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
    color: lighten(#2d3748, 30%);
    cursor: pointer;
    
    &:hover {
      color: $primary;
    }
  }
}

.password-strength {
  margin-top: $spacing-xs;
  
  .strength-bar {
    height: 4px;
    background-color: lighten(#2d3748, 70%);
    border-radius: $border-radius-full;
    margin-bottom: $spacing-xs;
    overflow: hidden;
  }
  
  .strength-indicator {
    height: 100%;
    border-radius: $border-radius-full;
    transition: width 0.3s ease;
    
    &.weak {
      background-color: #ff5252;
    }
    
    &.medium {
      background-color: #ffa726;
    }
    
    &.strong {
      background-color: #66bb6a;
    }
    
    &.very-strong {
      background-color: #43a047;
    }
  }
  
  .strength-text {
    font-size: $font-size-xs;
    
    &.weak {
      color: #ff5252;
    }
    
    &.medium {
      color: #ffa726;
    }
    
    &.strong {
      color: #66bb6a;
    }
    
    &.very-strong {
      color: #43a047;
    }
  }
}

.password-match {
  margin-top: $spacing-xs;
  font-size: $font-size-xs;
  
  .match-success {
    color: #66bb6a;
  }
  
  .match-error {
    color: #ff5252;
  }
}

.checkbox-wrapper {
  @include flex(row, flex-start, flex-start);
  
  input[type="checkbox"] {
    margin-right: $spacing-xs;
    margin-top: 4px;
  }
  
  label {
    font-size: $font-size-sm;
    line-height: 1.4;
    
    a {
      color: $primary;
      
      &:hover {
        text-decoration: underline;
      }
    }
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

.login-link {
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

.form-text {
  color: color.adjust(#2d3748, $lightness: 30%);
}

.form-divider {
  background-color: color.adjust(#2d3748, $lightness: 70%);
}
</style>

