<template>
  <header class="header">
    <div class="header-top">
      <div class="container">
        <div class="header-top-content">
          <div class="header-contact">
            <a href="tel:+551199999999" class="header-contact-item">
              <font-awesome-icon icon="phone" /> (11) 95472-8628
            </a>
            <a href="mailto:contato@doodledreams.com.br" class="header-contact-item">
              <font-awesome-icon icon="envelope" /> contato@doodledreams.com.br
            </a>
          </div>
          <div class="header-social">
            <a href="https://www.tiktok.com/@doodle.dreams7?_t=ZM-8xXTSpmkuA9&_r=1" class="header-social-item" target="_blank" rel="noopener">
              <font-awesome-icon :icon="['fab', 'tiktok']" />
            </a>
            <a href="https://www.facebook.com/profile.php?id=61578009051256&mibextid=wwXIfr" class="header-social-item" target="_blank" rel="noopener">
              <font-awesome-icon :icon="['fab', 'facebook']" />
            </a>
            <a href="https://www.instagram.com/doodle_dreams.colorir?igsh=MTFka3U4eGRhb3A1aA%3D%3D&utm_source=qr" class="header-social-item" target="_blank" rel="noopener">
              <font-awesome-icon :icon="['fab', 'instagram']" />
            </a>
          </div>
        </div>
      </div>
    </div>

    <div class="header-main">
      <div class="container">
        <div class="header-main-content">
          <div class="header-logo">
            <router-link to="/">
              <h1>Doodle Dreams</h1>
            </router-link>
          </div>

          <div class="header-search">
            <form @submit.prevent="search" class="search-form">
              <input type="text" v-model="searchQuery" placeholder="Buscar livros, coleções..." class="search-input">
              <button type="submit" class="search-button">
                <font-awesome-icon icon="search" />
              </button>
            </form>
          </div>

          <div class="header-actions">
            <div v-if="isLoggedIn" class="header-action-item">
              <router-link to="/perfil" class="header-action-link">
                <font-awesome-icon icon="user-circle" />
                <span class="header-action-text">Minha Conta</span>
              </router-link>
            </div>
            <div v-else class="header-action-item">
              <router-link to="/login" class="header-action-link">
                <font-awesome-icon icon="user" />
                <span class="header-action-text">Entrar / Cadastrar</span>
              </router-link>
            </div>
            <div v-if="isLoggedIn" class="header-action-item favorites-item">
              <router-link to="/favoritos" class="header-action-link favorites-link">
                <font-awesome-icon icon="heart" />
                <span class="header-action-text">Favoritos</span>
                <span v-if="totalFavoritos > 0" class="favorites-count">{{ totalFavoritos }}</span>
              </router-link>
            </div>
            <div class="header-action-item cart-item">
              <router-link to="/carrinho" class="header-action-link cart-link">
                <font-awesome-icon icon="shopping-cart" />
                <span class="header-action-text">Carrinho</span>
                <span v-if="itemCount > 0" class="cart-count">{{ itemCount }}</span>
              </router-link>
            </div>
            <!-- Botão de menu (versão mobile) -->
            <div class="header-action-item mobile-only">
              <button class="mobile-menu-toggle" @click="toggleMobileMenu" aria-label="Abrir Menu">
                <span class="toggle-bar"></span>
                <span class="toggle-bar"></span>
                <span class="toggle-bar"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="header-nav">
      <div class="container">
        <nav class="main-nav">
          <ul class="nav-list">
            <li class="nav-item">
              <router-link to="/" class="nav-link">Home</router-link>
            </li>
            <li class="nav-item has-dropdown">
              <a href="#" class="nav-link" @click.prevent="toggleDropdown('catalogo')">
                Catálogo <font-awesome-icon icon="chevron-down" />
              </a>
              <div class="dropdown-menu" :class="{ 'active': activeDropdown === 'catalogo' }">
                <div class="dropdown-content">
                  <div class="dropdown-column">
                    <h4 class="dropdown-title">Por Categoria</h4>
                    <ul class="dropdown-list">
                      <li v-for="categoria in categorias" :key="categoria.id">
                        <router-link :to="`/catalogo?categorias=${categoria.id}`" class="dropdown-link" @click="closeDropdown">
                          {{ categoria.nome }}
                        </router-link>
                      </li>
                    </ul>
                  </div>
                  <div class="dropdown-column">
                    <h4 class="dropdown-title">Destaques</h4>
                    <ul class="dropdown-list">
                      <li>
                        <router-link to="/catalogo?ordenarPor=mais-vendidos" class="dropdown-link" @click="closeDropdown">
                          Mais Vendidos
                        </router-link>
                      </li>
                      <li>
                        <router-link to="/catalogo?ordenarPor=lancamentos" class="dropdown-link" @click="closeDropdown">
                          Lançamentos
                        </router-link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </li>
            <li class="nav-item">
              <router-link to="/assinatura" class="nav-link">Assinatura</router-link>
            </li>
            <li class="nav-item">
              <a href="/sobre" class="nav-link">Sobre Nós</a>
            </li>
          
          </ul>
        </nav>

        <button class="mobile-menu-toggle" @click="toggleMobileMenu">
          <span class="toggle-bar"></span>
          <span class="toggle-bar"></span>
          <span class="toggle-bar"></span>
        </button>
      </div>
    </div>

    <!-- Menu Mobile -->
    <div class="mobile-menu" :class="{ 'active': mobileMenuOpen }">
      <div class="mobile-menu-header">
        <h3>Menu</h3>
        <button class="mobile-menu-close" @click="toggleMobileMenu">
          <font-awesome-icon icon="times" />
        </button>
      </div>
      <nav class="mobile-nav">
        <ul class="mobile-nav-list">
          <li class="mobile-nav-item">
            <router-link to="/" class="mobile-nav-link" @click="closeMobileMenu">Home</router-link>
          </li>
          <li class="mobile-nav-item">
            <a href="#" class="mobile-nav-link" @click.prevent="toggleMobileSubmenu('catalogo')">
              Catálogo
              <font-awesome-icon :icon="activeMobileSubmenu === 'catalogo' ? 'chevron-down' : 'chevron-right'" />
            </a>
            <ul class="mobile-submenu" :class="{ 'active': activeMobileSubmenu === 'catalogo' }">
              <li v-for="categoria in categorias" :key="categoria.id">
                <router-link :to="`/catalogo?categorias=${categoria.id}`" class="mobile-submenu-link" @click="closeMobileMenu">
                  {{ categoria.nome }}
                </router-link>
              </li>
              <li>
                <router-link to="/catalogo?ordenarPor=mais-vendidos" class="mobile-submenu-link" @click="closeMobileMenu">
                  Mais Vendidos
                </router-link>
              </li>
              <li>
                <router-link to="/catalogo?ordenarPor=lancamentos" class="mobile-submenu-link" @click="closeMobileMenu">
                  Lançamentos
                </router-link>
              </li>
            </ul>
          </li>
          <li class="mobile-nav-item">
            <router-link to="/assinatura" class="mobile-nav-link" @click="closeMobileMenu">Assinatura</router-link>
          </li>
          <li class="mobile-nav-item">
            <a href="#" class="mobile-nav-link">Sobre Nós</a>
          </li>
          <li class="mobile-nav-item">
            <a href="#" class="mobile-nav-link">Contato</a>
          </li>
        </ul>
      </nav>
      <div class="mobile-menu-footer">
        <div class="mobile-menu-contact">
          <a href="tel:+551199999999" class="mobile-contact-item">
            <font-awesome-icon icon="phone" /> (11) 95472-8628
          </a>
          <a href="mailto:contato@doodledreams.com.br" class="mobile-contact-item">
            <font-awesome-icon icon="envelope" /> contato@doodledreams.com.br
          </a>
        </div>
        <div class="mobile-menu-social">
          <a href="https://www.tiktok.com/@doodle.dreams7?_t=ZM-8xXTSpmkuA9&_r=1" class="mobile-social-item" target="_blank" rel="noopener">
            <font-awesome-icon :icon="['fab', 'tiktok']" />
          </a>
          <a href="https://www.facebook.com/profile.php?id=61578009051256&mibextid=wwXIfr" class="mobile-social-item" target="_blank" rel="noopener">
            <font-awesome-icon :icon="['fab', 'facebook']" />
          </a>
          <a href="https://www.instagram.com/doodle_dreams.colorir?igsh=MTFka3U4eGRhb3A1aA%3D%3D&utm_source=qr" class="mobile-social-item" target="_blank" rel="noopener">
            <font-awesome-icon :icon="['fab', 'instagram']" />
          </a>
        </div>
      </div>
    </div>

    <!-- Overlay para o menu mobile -->
    <div class="mobile-menu-overlay" :class="{ 'active': mobileMenuOpen }" @click="closeMobileMenu"></div>
  </header>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { useCart } from '@/composables/useCart';
import { useFavorites } from '@/composables/useFavorites';
import categoriaService from '@/services/categoriaService';
import { useRouter } from 'vue-router';

export default {
  name: 'Header',
  setup() {
    const router = useRouter();
    const { isLoggedIn } = useAuth();
    const { cart } = useCart();
    const { totalFavoritos } = useFavorites();
    
    const searchQuery = ref('');
    const categorias = ref([]);
    const activeDropdown = ref(null);
    const mobileMenuOpen = ref(false);
    const activeMobileSubmenu = ref(null);

    const itemCount = computed(() => cart.value?.itens?.reduce((sum, item) => sum + item.quantidade, 0) || 0);

    const fetchCategorias = async () => {
      try {
        const response = await categoriaService.getCategorias();
        categorias.value = response.categorias || response;
      } catch (error) {
        console.error("Erro ao buscar categorias para o header:", error);
      }
    };

    const toggleDropdown = (menu) => {
      activeDropdown.value = activeDropdown.value === menu ? null : menu;
    };
    
    const toggleMobileMenu = () => {
      mobileMenuOpen.value = !mobileMenuOpen.value;
      if (!mobileMenuOpen.value) {
        activeMobileSubmenu.value = null;
      }
      document.body.style.overflow = mobileMenuOpen.value ? 'hidden' : '';
    };

    const closeMobileMenu = () => {
      mobileMenuOpen.value = false;
      activeMobileSubmenu.value = null;
      document.body.style.overflow = '';
    };

    const toggleMobileSubmenu = (submenu) => {
      activeMobileSubmenu.value = activeMobileSubmenu.value === submenu ? null : submenu;
    };

    const search = async () => {
      if (searchQuery.value.trim()) {
        await router.push({
          path: '/catalogo',
          query: { 
            busca: searchQuery.value.trim()
          }
        });
        searchQuery.value = '';
      }
    };

    const closeDropdown = () => {
        activeDropdown.value = null;
    }

    onMounted(() => {
    document.addEventListener('click', (e) => {
        const target = e.target;
        if (!target.closest('.has-dropdown') && activeDropdown.value) {
          activeDropdown.value = null;
      }
      });
    fetchCategorias();
    });

    return {
      searchQuery,
      categorias,
      activeDropdown,
      mobileMenuOpen,
      activeMobileSubmenu,
      itemCount,
      totalFavoritos,
      isLoggedIn,
      toggleDropdown,
      toggleMobileMenu,
      closeMobileMenu,
      toggleMobileSubmenu,
      search,
      closeDropdown
    };
  },
}
</script>

<style lang="scss" scoped>
@use 'sass:color';
@use '@/assets/scss/variables' as *;
@use '@/assets/scss/mixins' as *;

.header {
  position: relative;
  z-index: 100;
}

.header-top {
  background-color: $dark;
  color: $white;
  padding: $spacing-xs 0;
  font-size: $font-size-sm;
  
  &-content {
    @include flex(row, space-between, center);
  }
}

.header-contact {
  @include flex(row, flex-start, center);
  
  &-item {
    margin-right: $spacing-md;
    
    &:hover {
      color: $primary;
    }
    
    svg {
      margin-right: $spacing-xs;
    }
  }
}

.header-social {
  @include flex(row, flex-end, center);
  
  &-item {
    margin-left: $spacing-sm;
    font-size: $font-size-md;
    
    &:hover {
      color: $primary;
    }
  }
}

.header-main {
  background-color: $white;
  padding: $spacing-md 0;
  box-shadow: $shadow-sm;
  
  &-content {
    @include flex(row, space-between, center);
    
    @include respond-to(md) {
      flex-wrap: nowrap;
    }
  }
}

.header-logo {
  h1 {
    font-size: $font-size-2xl;
    color: $dark;
    font-family: $font-family-heading;
    font-weight: $font-weight-bold;
    margin: 0;
  }
}

.header-search {
  flex-grow: 1;
  max-width: 500px;
  margin: 0 $spacing-lg;
  
  .search-form {
    @include flex(row, center, stretch);
    position: relative;
    height: 50px;

    border: 1px solid $light;
    border-radius: $border-radius-md;
  }
  
  .search-input {
    width: 100%;
    border-radius: $border-radius-md;
    border: 1px solid $light;
    padding-right: 40px;
    padding-left: 15px;
    transition: $transition-base;
    outline: none;

    &:focus {
      border-color: $primary;
      box-shadow: 0 0 0 3px rgba($primary, 0.2);
    }
  }
  
  .search-button {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    width: 40px;
    background-color: $primary;
    color: $white;
    border-top-right-radius: $border-radius-md;
    border-bottom-right-radius: $border-radius-md;
    
    &:hover {
      background-color: color.adjust($primary, $lightness: -10%);
    }
  }
}
 
.header-actions {
  @include flex(row, flex-end, center);
}

.header-action-item {
  margin-left: $spacing-md;
  position: relative;
  
  .header-action-link {
    @include flex(row, center, center);
    flex-direction: column;
    
    svg {
      font-size: $font-size-xl;
      margin-bottom: $spacing-xs;
    }
    
    .header-action-text {
      font-size: $font-size-xs;
      font-weight: 500;
    }
    
    &:hover {
      color: $primary;
    }
    
    &.cart-link {
      position: relative;
    }
  }
  
  .cart-count,
  .favorites-count {
    position: absolute;
    top: -8px;
    right: -12px;
    background-color: var(--primary-color);
    color: white;
    border-radius: 50%;
    padding: 2px 6px;
    font-size: 0.75rem;
    font-weight: bold;
    border: 1px solid white;
  }
}

.header-nav {
  background-color: $light;
  border-top: 1px solid rgba($dark, 0.1);
  border-bottom: 1px solid rgba($dark, 0.1);
  background-color: $white;
  .container {
    @include flex(row, space-between, center);
  }
}

.main-nav {
  width: 100%;
}

.nav-list {
  @include flex(row, flex-start, center);
  margin: 0;
  padding: 0;
  
  @include respond-to(md) {
    justify-content: center;
  }
}

.nav-item {
  position: relative;
  
  &.has-dropdown {
    position: relative;
  }
  
  .nav-link {
    display: block;
    padding: $spacing-md;
    font-weight: 500;
    transition: $transition-base;
    
    &:hover {
      color: $primary;
    }
    
    svg {
      margin-left: $spacing-xs;
      font-size: $font-size-xs;
    }
  }
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: $white;
  box-shadow: $shadow-md;
  border-radius: $border-radius-md;
  min-width: 220px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: all 0.3s ease;
  z-index: 100;
  
  &.active {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
}

.dropdown-content {
  @include flex(row, flex-start, flex-start);
  padding: $spacing-md;
}

.dropdown-column {
  padding: 0 $spacing-md;
  min-width: 200px;
  
  &:not(:last-child) {
    border-right: 1px solid rgba($dark, 0.1);
  }
}

.dropdown-title {
  font-size: $font-size-md;
  margin-bottom: $spacing-sm;
  color: $primary;
}

.dropdown-list {
  li {
    margin-bottom: $spacing-xs;
  }
}

.dropdown-link {
  display: block;
  font-size: $font-size-sm;
  padding: $spacing-xs 0;
  
  &:hover {
    color: $primary;
  }
}

// Mobile menu
.mobile-menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 20px;
  
  .toggle-bar {
    width: 100%;
    height: 2px;
    background-color: $dark;
    transition: $transition-base;
  }
  
  @include respond-to(md) {
    display: none;
  }
}

.mobile-menu {
  position: fixed;
  top: 0;
  right: -300px;
  width: 280px;
  height: 100vh;
  background-color: $white;
  z-index: 1000;
  transition: right 0.3s ease;
  overflow-y: auto;
  box-shadow: $shadow-lg;
  
  &.active {
    right: 0;
  }
}

.mobile-menu-header {
  @include flex(row, space-between, center);
  padding: $spacing-md;
  border-bottom: 1px solid rgba($dark, 0.1);
  
  h3 {
    margin: 0;
    font-size: $font-size-lg;
  }
}

.mobile-menu-close {
  font-size: $font-size-xl;
  color: $dark;
  
  &:hover {
    color: $primary;
  }
}

.mobile-nav-list {
  padding: $spacing-md;
}

.mobile-nav-item {
  margin-bottom: $spacing-sm;
}

.mobile-nav-link {
  display: block;
  padding: $spacing-sm 0;
  font-weight: 500;
  @include flex(row, space-between, center);
  
  &:hover {
    color: $primary;
  }
}

.mobile-submenu {
  padding-left: $spacing-md;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
  
  &.active {
    max-height: 500px;
  }
  
  li {
    margin-top: $spacing-xs;
  }
}

.mobile-submenu-link {
  display: block;
  padding: $spacing-xs 0;
  font-size: $font-size-sm;
  
  &:hover {
    color: $primary;
  }
}

.mobile-menu-footer {
  padding: $spacing-md;
  border-top: 1px solid rgba($dark, 0.1);
}

.mobile-menu-contact {
  margin-bottom: $spacing-md;
  
  .mobile-contact-item {
    display: block;
    margin-bottom: $spacing-xs;
    font-size: $font-size-sm;
    
    svg {
      margin-right: $spacing-xs;
    }
    
    &:hover {
      color: $primary;
    }
  }
}

.mobile-menu-social {
  @include flex(row, flex-start, center);
  
  .mobile-social-item {
    margin-right: $spacing-md;
    font-size: $font-size-lg;
    
    &:hover {
      color: $primary;
    }
  }
}

.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba($dark, 0.5);
  z-index: 999;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  
  &.active {
    opacity: 1;
    visibility: visible;
  }
}

// Responsividade
@media (max-width: #{ $breakpoint-md - 1 }) {
  .header-top {
    display: none;
  }
  
  .header-main-content {
    flex-wrap: nowrap;
  }
  
  .header-logo {
    order: 1;
    width: auto;
    h1 { font-size: $font-size-lg; }
  }
  
  .header-search {
    display: none;
  }
  
  .header-actions {
    order: 2;
    width: auto;
    @include flex(row, flex-end, center);
    
    .header-action-item {
      display: none;
    }
    
    .cart-item {
      display: flex;
    }
    
    .mobile-only {
      display: flex;
      margin-left: $spacing-md;

      .mobile-menu-toggle {
        display: flex;
      }
    }
  }
  
  .header-nav .mobile-menu-toggle {
    display: none;
  }
  
  .main-nav {
    display: none;
  }
}
</style>