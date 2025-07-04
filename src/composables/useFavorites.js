import { ref, watch } from 'vue';
import favoritoService from '@/services/favoritoService';
import { useAuth } from './useAuth';
import { useGhostSignup } from './useGhostSignup';
import { useNotifications } from './useNotifications';

// --- Estado Global ---
const totalFavoritos = ref(0);

// --- Lógica Reativa ---
// Obtém o estado de login reativo do useAuth
const { isLoggedIn, user } = useAuth();
const { openGhostSignup } = useGhostSignup();
const { addNotification } = useNotifications();

// Função para buscar os favoritos
const fetchTotalFavoritos = async () => {
  // Apenas busca se o usuário estiver logado
  if (isLoggedIn.value) {
    try {
      const response = await favoritoService.contarFavoritos();
      totalFavoritos.value = response.data.total || 0;
    } catch (error) {
      console.error('Erro ao buscar total de favoritos:', error);
      totalFavoritos.value = 0;
    }
  } else {
    // Se não estiver logado, zera a contagem
    totalFavoritos.value = 0;
  }
};

// Observa o estado de login. Se mudar (login/logout), a contagem é atualizada.
// immediate: true -> executa a primeira vez que é definido.
watch(isLoggedIn, fetchTotalFavoritos, { immediate: true });

// --- Hook Principal ---
export function useFavorites() {
  const favoritos = ref([]);
  const isLoading = ref(false);

  const carregarFavoritos = async () => {
    if (!user.value) return;
    
    try {
      isLoading.value = true;
      const response = await favoritoService.getFavoritos();
      favoritos.value = response.data;
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
      addNotification({
        message: 'Erro ao carregar favoritos',
        type: 'error'
      });
    } finally {
      isLoading.value = false;
    }
  };

  const adicionarFavorito = async (produto) => {
    if (!user.value) {
      openGhostSignup(() => adicionarFavorito(produto));
      return;
    }

    try {
      isLoading.value = true;
      await favoritoService.addFavorito({ produtoId: produto.id });
      await carregarFavoritos();
      addNotification({
        message: 'Produto adicionado aos favoritos',
        type: 'success'
      });
    } catch (error) {
      console.error('Erro ao adicionar aos favoritos:', error);
      addNotification({
        message: 'Erro ao adicionar aos favoritos',
        type: 'error'
      });
    } finally {
      isLoading.value = false;
    }
  };

  const removerFavorito = async (produtoId) => {
    if (!user.value) return;

    try {
      isLoading.value = true;
      await favoritoService.removeFavorito(produtoId);
      await carregarFavoritos();
      addNotification({
        message: 'Produto removido dos favoritos',
        type: 'success'
      });
    } catch (error) {
      console.error('Erro ao remover dos favoritos:', error);
      addNotification({
        message: 'Erro ao remover dos favoritos',
        type: 'error'
      });
    } finally {
      isLoading.value = false;
    }
  };

  const isFavorito = (produtoId) => {
    return favoritos.value.some(f => f.produto_id === produtoId);
  };

  return {
    favoritos,
    isLoading,
    carregarFavoritos,
    adicionarFavorito,
    removerFavorito,
    isFavorito
  };
} 