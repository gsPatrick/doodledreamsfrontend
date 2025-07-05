import { ref, watch } from 'vue';
import favoritoService from '@/services/favoritoService';
import { useAuth } from './useAuth';
import { useGhostSignup } from './useGhostSignup';
import { useNotifications } from './useNotifications';

// --- Estado Global ---
// O estado global deve ser seguro. O total de favoritos é apenas um número.
const totalFavoritos = ref(0); 

export function useFavorites() {
  // Obtém o estado de login reativo do useAuth
  const { isLoggedIn, user, isAuthInitialized } = useAuth();
  const { openGhostSignup } = useGhostSignup();
  const { addNotification } = useNotifications();
  
  const favoritos = ref([]);
  const isLoading = ref(false);

  // Função para buscar os favoritos e a contagem
  const fetchFavoritesData = async () => {
    // Apenas busca se o usuário estiver logado e a autenticação já tiver sido inicializada
    if (isLoggedIn.value && isAuthInitialized.value) {
      try {
        // Busca a lista completa de favoritos
        const responseList = await favoritoService.getFavoritos();
        favoritos.value = responseList.data || [];
        
        // Atualiza a contagem total baseada no comprimento da lista recebida
        totalFavoritos.value = favoritos.value.length;

      } catch (error) {
        console.error('Erro ao buscar dados dos favoritos:', error);
        favoritos.value = [];
        totalFavoritos.value = 0;
      }
    } else {
      // Se não estiver logado, zera tudo para garantir um estado limpo
      favoritos.value = [];
      totalFavoritos.value = 0;
    }
  };

  // Observa o estado de login e a inicialização. Se mudar, os dados são atualizados.
  // Usar watch em um array de fontes é mais robusto.
  watch([isLoggedIn, isAuthInitialized], ([loggedIn, authInitialized]) => {
    if (authInitialized) {
        fetchFavoritesData();
    }
  }, { immediate: true });

  const carregarFavoritos = async () => {
    isLoading.value = true;
    await fetchFavoritesData();
    isLoading.value = false;
  };

  const adicionarFavorito = async (produto) => {
    // Checagem de segurança para o objeto do produto
    if (!produto || !produto.id) {
        console.error("Tentativa de adicionar um produto inválido aos favoritos.");
        return;
    }

    // Se não estiver logado, abre o modal de cadastro rápido
    if (!isLoggedIn.value) {
      openGhostSignup(() => adicionarFavorito(produto));
      return;
    }

    try {
      await favoritoService.addFavorito({ produtoId: produto.id });
      // Após adicionar, busca novamente todos os dados para manter a consistência
      await fetchFavoritesData(); 
      addNotification({
        message: 'Produto adicionado aos favoritos!',
        type: 'success'
      });
    } catch (error) {
      console.error('Erro ao adicionar aos favoritos:', error);
      addNotification({
        message: error.response?.data?.erro || 'Erro ao adicionar aos favoritos',
        type: 'error'
      });
    }
  };

  const removerFavorito = async (produtoId) => {
    // Checagem de segurança
    if (!isLoggedIn.value) return;

    try {
      await favoritoService.removeFavorito(produtoId);
      // Após remover, busca novamente todos os dados
      await fetchFavoritesData(); 
      addNotification({
        message: 'Produto removido dos favoritos',
        type: 'success'
      });
    } catch (error) {
      console.error('Erro ao remover dos favoritos:', error);
      addNotification({
        message: error.response?.data?.erro || 'Erro ao remover dos favoritos',
        type: 'error'
      });
    }
  };

  const isFavorito = (produtoId) => {
    // Checagem segura
    return favoritos.value.some(f => f && f.produtoId === produtoId);
  };

  // O retorno do hook para os componentes usarem
  return {
    favoritos,
    totalFavoritos, // Exporta a contagem global
    isLoading,
    carregarFavoritos,
    adicionarFavorito,
    removerFavorito,
    isFavorito
  };
}