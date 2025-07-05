import { ref, computed, watch } from 'vue';
import cartService from '../services/cartService';
import { useAuth } from './useAuth';
import { useNotifications } from './useNotifications';

// --- ESTADO GLOBAL REATIVO ---
// Inicia com uma estrutura válida para evitar erros de 'null'
const cart = ref({ itens: [], total: 0 });
const isLoading = ref(false);

export function useCart() {
  const { isLoggedIn, isAuthInitialized } = useAuth();
  const { addNotification } = useNotifications();

  // Carrega o carrinho da API (funciona para logados e convidados)
  const fetchCart = async () => {
    // Só executa se a verificação de autenticação inicial já terminou.
    if (!isAuthInitialized.value) return; 
    
    isLoading.value = true;
    try {
      const response = await cartService.getCart();
      // Garante que 'cart.value' sempre seja um objeto válido, mesmo se a API retornar algo inesperado
      cart.value = response.data && Array.isArray(response.data.itens) 
                   ? response.data 
                   : { itens: [], total: 0 };
    } catch (error) {
      console.error('Erro ao carregar carrinho da API:', error);
      addNotification({ message: 'Não foi possível carregar seu carrinho.', type: 'error' });
      // Reseta para um estado seguro em caso de erro
      cart.value = { itens: [], total: 0 };
    } finally {
      isLoading.value = false;
    }
  };

  // Observa a flag de inicialização da autenticação para carregar o carrinho pela primeira vez.
  watch(isAuthInitialized, (initialized) => {
    if (initialized) {
      fetchCart();
    }
  }, { immediate: true });
  
  // Observa o estado de login para acionar a migração.
  watch(isLoggedIn, async (loggedIn, wasLoggedIn) => {
    // wasLoggedIn é undefined na primeira execução, precisamos tratar isso.
    if (wasLoggedIn === undefined) {
      return; // Não faz nada na carga inicial, a lógica acima já cuida disso.
    }
    
    // Ação ocorre apenas quando o usuário FAZ LOGIN (de deslogado para logado)
    if (loggedIn && wasLoggedIn === false) {
      console.log("Usuário fez login. Tentando migrar carrinho de convidado...");
      isLoading.value = true;
      try {
        await cartService.migrateCart();
        await fetchCart(); // Recarrega o carrinho final do servidor
        addNotification({ message: 'Seu carrinho foi atualizado!', type: 'success' });
      } catch(error) {
        console.error("Erro ao migrar carrinho:", error);
        addNotification({ message: 'Não foi possível migrar os itens do seu carrinho anterior.', type: 'error' });
      } finally {
        isLoading.value = false;
      }
    } else if (!loggedIn && wasLoggedIn === true) {
        // Se o usuário deslogou, recarrega o carrinho (que agora será de um novo convidado)
        fetchCart();
    }
  });

  const adicionarAoCarrinho = async (produto, quantidade = 1, variacaoId = null) => {
    if (!produto || !produto.id) {
        console.error("Tentativa de adicionar um produto inválido ao carrinho.");
        return;
    }

    isLoading.value = true;
    try {
      const response = await cartService.addToCart(produto.id, quantidade, variacaoId);
      cart.value = response.data;
      addNotification({ message: 'Produto adicionado ao carrinho!', type: 'success' });
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      addNotification({ message: error.response?.data?.erro || 'Erro ao adicionar produto.', type: 'error' });
    } finally {
      isLoading.value = false;
    }
  };
  
  const removerDoCarrinho = async (produtoId, variacaoId) => {
    isLoading.value = true;
    try {
        const response = await cartService.removeItem(produtoId, variacaoId);
        cart.value = response.data;
    } catch(error) {
        console.error('Erro ao remover do carrinho:', error);
    } finally {
        isLoading.value = false;
    }
  };

  const atualizarQuantidade = async (produtoId, variacaoId, quantidade) => {
    if (quantidade <= 0) {
        await removerDoCarrinho(produtoId, variacaoId);
        return;
    }
    isLoading.value = true;
    try {
        const response = await cartService.updateItem(produtoId, quantidade, variacaoId);
        cart.value = response.data;
    } catch(error) {
        console.error('Erro ao atualizar quantidade:', error);
    } finally {
        isLoading.value = false;
    }
  };

  const subtotal = computed(() => {
    return cart.value?.itens?.reduce((acc, item) => acc + (item.preco * item.quantidade), 0) || 0;
  });

  // --- MUDANÇA CRÍTICA AQUI ---
  // A propriedade computada agora se chama 'itemCount' para corresponder ao seu template Header.vue
  const itemCount = computed(() => {
    return cart.value?.itens?.reduce((acc, item) => acc + item.quantidade, 0) || 0;
  });

  // --- MUDANÇA CRÍTICA AQUI ---
  // O bloco de retorno agora exporta 'itemCount' em vez de 'totalItems'.
  return {
    cart: computed(() => cart.value?.itens || []), 
    isLoading,
    subtotal,
    itemCount, // <-- Corrigido para corresponder ao seu Header.vue
    adicionarAoCarrinho,
    removerDoCarrinho,
    atualizarQuantidade,
  };
}