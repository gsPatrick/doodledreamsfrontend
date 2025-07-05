import { ref, watch, computed } from 'vue';
import favoritoService from '@/services/favoritoService';
import { useAuth } from './useAuth';
import { useGhostSignup } from './useGhostSignup';

const favoritos = ref([]);
const isLoading = ref(false);

export function useFavorites() {
  const { isLoggedIn, isAuthInitialized } = useAuth();
  const { openGhostSignup } = useGhostSignup();

  const fetchFavorites = async () => {
    if (!isLoggedIn.value || !isAuthInitialized.value) {
        favoritos.value = [];
        return;
    }
    isLoading.value = true;
    try {
        const response = await favoritoService.getFavoritos();
        favoritos.value = Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        console.error('Erro ao buscar favoritos:', error);
        favoritos.value = [];
    } finally {
        isLoading.value = false;
    }
  };
  
  watch([isLoggedIn, isAuthInitialized], (values) => {
    if (values[1]) fetchFavorites(); // Se auth está inicializado
  }, { immediate: true });

  const adicionarFavorito = async (produto) => {
    if (!produto || !produto.id) return;
    if (!isLoggedIn.value) {
      openGhostSignup(() => adicionarFavorito(produto));
      return;
    }
    await favoritoService.addFavorito({ produtoId: produto.id });
    await fetchFavorites();
  };

  const removerFavorito = async (produtoId) => {
    if (!isLoggedIn.value) return;
    await favoritoService.removeFavorito(produtoId);
    await fetchFavorites();
  };

  return {
    favoritos: computed(() => favoritos.value),
    totalFavoritos: computed(() => favoritos.value.length),
    isLoading: computed(() => isLoading.value),
    isFavorito: (produtoId) => favoritos.value.some(f => f?.produtoId === produtoId),
    adicionarFavorito,
    removerFavorito,
  };
}