<template>
  <footer class="footer">
   

    <div class="footer-main">
      <div class="container">
        <div class="row">
          <div class="col-12 col-md-4 footer-column">
            <div class="footer-logo">
              <h2>Doodle Dreams</h2>
            </div>
            <p class="footer-about">
              Livros ilustrados e educativos que inspiram a imaginação e o aprendizado para todas as idades.
              Nossa missão é criar experiências literárias mágicas e acolhedoras.
            </p>
            <div class="footer-social">
              <a href="#" class="footer-social-link">
                <font-awesome-icon :icon="['fab', 'facebook']" />
              </a>
              <a href="#" class="footer-social-link">
                <font-awesome-icon :icon="['fab', 'instagram']" />
              </a>
              <a href="#" class="footer-social-link">
                <font-awesome-icon :icon="['fab', 'pinterest']" />
              </a>
              <a href="#" class="footer-social-link">
                <font-awesome-icon :icon="['fab', 'twitter']" />
              </a>
            </div>
          </div>

          <div class="col-12 col-md-8">
            <div class="footer-links-container">
              <div class="footer-column">
                <h4 class="footer-title">Navegação</h4>
                <ul class="footer-links">
                  <li><router-link to="/" class="footer-link">Home</router-link></li>
                  <li><router-link to="/catalogo" class="footer-link">Catálogo</router-link></li>
                  <li><router-link to="/assinatura" class="footer-link">Assinatura</router-link></li>
                  <li><router-link to="/sobre" class="footer-link">Sobre Nós</router-link></li>
                  <li><a href="#" class="footer-link">Contato</a></li>
                </ul>
              </div>

              <div class="footer-column">
                <h4 class="footer-title">Categorias</h4>
                <ul class="footer-links">
                  <li><router-link to="/catalogo/infantil" class="footer-link">Infantil</router-link></li>
                  <li><router-link to="/catalogo/juvenil" class="footer-link">Juvenil</router-link></li>
                  <li><router-link to="/catalogo/adulto" class="footer-link">Adulto</router-link></li>
                  <li><router-link to="/catalogo?filter=mais-vendidos" class="footer-link">Mais Vendidos</router-link></li>
                  <li><router-link to="/catalogo?filter=lancamentos" class="footer-link">Lançamentos</router-link></li>
                </ul>
              </div>

              <div class="footer-column">
                <h4 class="footer-title">Ajuda</h4>
                <ul class="footer-links">
                  <li><a href="#" class="footer-link">Como Comprar</a></li>
                  <li><a href="#" class="footer-link">Pagamento</a></li>
                  <li><a href="#" class="footer-link">Envio</a></li>
                  <li><a href="#" class="footer-link">Trocas e Devoluções</a></li>
                  <li><a href="#" class="footer-link">FAQ</a></li>
                </ul>
              </div>

              <div class="footer-column">
                <h4 class="footer-title">Contato</h4>
                <ul class="footer-contact">
                 
                  <li class="footer-contact-item">
                    <font-awesome-icon icon="phone" />
                    <span>(11) 95472-8628</span>
                  </li>
                  <li class="footer-contact-item">
                    <font-awesome-icon icon="envelope" />
                    <span>contato@doodledreams.com.br</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="container">
        <div class="footer-bottom-content">
          <div class="footer-copyright">
            &copy; {{ currentYear }} Doodle Dreams. Todos os direitos reservados.
          </div>
          <div class="footer-legal">
            <router-link to="/termos-de-uso" class="footer-legal-link">Termos de Uso</router-link>
            <router-link to="/politica-de-privacidade" class="footer-legal-link">Política de Privacidade</router-link>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
  data() {
    return {
      email: '',
      currentYear: new Date().getFullYear()
    }
  },
  methods: {
    subscribeNewsletter() {
      // Aqui seria implementada a lógica para assinar a newsletter
      if (this.email) {
        alert(`E-mail ${this.email} cadastrado com sucesso!`)
        this.email = ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@use 'sass:color';
@use '@/assets/scss/variables' as *;
@use '@/assets/scss/mixins' as *;

.footer {
  background-color: $dark;
  margin-top: $spacing-3xl;
}

.footer-newsletter {
  background-color: $secondary;
  padding: $spacing-xl 0;
}

.newsletter-wrapper {
  @include flex(row, space-between, center);
  flex-wrap: wrap;
  
  @include respond-to(md) {
    flex-wrap: nowrap;
  }
}

.newsletter-content {
  margin-bottom: $spacing-md;
  
  @include respond-to(md) {
    margin-bottom: 0;
    margin-right: $spacing-xl;
  }
}

.newsletter-title {
  color: $white;
  font-size: $font-size-xl;
  margin-bottom: $spacing-xs;
}

.newsletter-text {
  color: $white;
  max-width: 400px;
}

.newsletter-form {
  @include flex(row, flex-start, flex-end);
  flex-wrap: wrap;
  
  .form-group {
    margin-right: $spacing-sm;
    margin-bottom: $spacing-sm;
    min-width: 250px;
  }
  
  .btn {
    white-space: nowrap;
  }
  
  @include respond-to(md) {
    flex-wrap: nowrap;
    
    .form-group {
      margin-bottom: 0;
    }
  }
}

.footer-main {
  padding: $spacing-2xl 0;
  background-color: $white;
}

.footer-logo {
  margin-bottom: $spacing-md;
  
  h2 {
    font-family: $font-family-heading;
    font-size: $font-size-2xl;
    color: $primary;
    margin: 0;
  }
}

.footer-about {
  margin-bottom: $spacing-md;
  font-size: $font-size-sm;
  color: color.adjust($dark, $lightness: 20%);
  max-width: 300px;
}

.footer-social {
  @include flex(row, flex-start, center);
  margin-bottom: $spacing-lg;
}

.footer-social-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: rgba($primary, 0.1);
  color: $primary;
  margin-right: $spacing-sm;
  transition: $transition-base;
  
  &:hover {
    background-color: $primary;
    color: $white;
    transform: translateY(-3px);
  }
}

.footer-column {
  margin-bottom: $spacing-xl;
}

.footer-title {
  font-size: $font-size-md;
  margin-bottom: $spacing-md;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 40px;
    height: 2px;
    background-color: $primary;
    border-radius: $border-radius-full;
  }
}

.footer-links {
  li {
    margin-bottom: $spacing-xs;
  }
}

.footer-link {
  font-size: $font-size-sm;
  color: color.adjust($dark, $lightness: 20%);
  transition: $transition-base;
  
  &:hover {
    color: $primary;
    padding-left: $spacing-xs;
  }
}

.footer-contact {
  li {
    margin-bottom: $spacing-sm;
  }
}

.footer-contact-item {
  @include flex(row, flex-start, flex-start);
  font-size: $font-size-sm;
  color: color.adjust($dark, $lightness: 20%);
  
  svg {
    margin-right: $spacing-sm;
    margin-top: 4px;
    color: $primary;
  }
}

.footer-bottom {
  background-color: $dark;
  padding: $spacing-md 0;
  color: $white;
}

.footer-bottom-content {
  @include flex(row, space-between, center);
  flex-wrap: wrap;
  
  @include respond-to(md) {
    flex-wrap: nowrap;
  }
}

.footer-copyright {
  font-size: $font-size-xs;
  margin-bottom: $spacing-sm;
  
  @include respond-to(md) {
    margin-bottom: 0;
  }
}

.footer-legal {
  @include flex(row, flex-end, center);
}

.footer-legal-link {
  font-size: $font-size-xs;
  color: rgba($white, 0.7);
  margin-left: $spacing-md;
  transition: $transition-base;
  
  &:hover {
    color: $primary;
  }
}

.footer-links-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  .footer-column {
    width: 50%;
    margin-bottom: $spacing-xl;

    @include respond-to(md) {
      width: auto;
      flex: 1;
      margin-bottom: 0;
      padding: 0 $spacing-sm;
    }
  }

  @media (max-width: 576px) {
    .footer-column {
      width: 100%;
    }
  }
}
</style>
