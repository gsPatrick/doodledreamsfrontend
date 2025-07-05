<template>
  <div id="app-wrapper">
    <!-- Componentes de layout fora do ErrorBoundary para que nunca sumam -->
    <Header />

    <main class="main-content">
      <!-- O ErrorBoundary envolve a área que pode falhar (suas páginas) -->
      <ErrorBoundary>
        <!-- A transição foi movida para dentro do ErrorBoundary -->
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </ErrorBoundary>
    </main>
    
    <!-- Componentes de layout e modais globais fora do ErrorBoundary -->
    <Footer />
    <ToastNotification />
    <LoadingModal v-if="isLoading" />
    <GhostSignupModal />
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
// Não precisamos importar useGhostSignup aqui, a não ser que você use o estado dele diretamente no App.vue
// import { useGhostSignup } from '@/composables/useGhostSignup';

// Importação dos componentes de layout e modais
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import ToastNotification from '@/components/ToastNotification.vue';
import LoadingModal from '@/components/LoadingModal.vue';
import GhostSignupModal from '@/components/modals/GhostSignupModal.vue';

// Importação do novo componente ErrorBoundary
import ErrorBoundary from '@/components/ErrorBoundary.vue';

export default {
  name: 'App',
  components: {
    // Registro de todos os componentes usados no template
    Header,
    Footer,
    ToastNotification,
    LoadingModal,
    GhostSignupModal,
    ErrorBoundary // <-- Registra o ErrorBoundary
  },
  setup() {
    const isLoading = ref(false);
    const router = useRouter();

    let loadingTimer = null;

    router.beforeEach((to, from, next) => {
      // Mostra o loader para navegações que podem demorar
      loadingTimer = setTimeout(() => {
        isLoading.value = true;
      }, 300); // Atraso para não piscar em navegações rápidas
      next();
    });

    router.afterEach(() => {
      // Esconde o loader após a navegação
      clearTimeout(loadingTimer);
      isLoading.value = false;
    });

    // Garantir que o modal de loading não fique preso se houver erro na navegação
    // O router.afterEach já faz isso, mas podemos manter como segurança extra.
    router.onError(() => {
        clearTimeout(loadingTimer);
        isLoading.value = false;
    });

    window.addEventListener('load', () => {
      isLoading.value = false;
    });

    return {
      isLoading
    };
  }
};
</script>

<style lang="scss">
// A diretiva @use só pode ser usada no topo do arquivo. Se 'main.scss' a utiliza,
// é melhor importá-la diretamente no arquivo SCSS principal do App.vue.
// Vamos assumir que seus estilos já estão configurados para funcionar.
@use '@/assets/scss/main.scss' as *;

#app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding: 0; // Ajuste conforme seu layout
}

// Estilos de transição para o router-view
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}


</style>