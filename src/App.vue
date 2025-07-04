<template>
  <div id="app-wrapper">
    <Header />
    <main class="main-content">
      <router-view />
    </main>
    <Footer />
    <ToastNotification />
    <LoadingModal v-if="isLoading" />
    <GhostSignupModal />
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useGhostSignup } from '@/composables/useGhostSignup';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import ToastNotification from '@/components/ToastNotification.vue';
import LoadingModal from '@/components/LoadingModal.vue';
import GhostSignupModal from '@/components/modals/GhostSignupModal.vue';

export default {
  name: 'App',
  components: {
    Header,
    Footer,
    ToastNotification,
    LoadingModal,
    GhostSignupModal
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
@use '@/assets/scss/main.scss' as *;

#app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
}

.global-loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.loader-spinner {
  color: $primary;
  font-size: 2rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

