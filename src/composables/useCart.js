import { ref, computed, watch } from 'vue';
import cartService from '../services/cartService';
import { useAuth } from './useAuth';
import { useNotifications } from './useNotifications';

const cart = ref({ itens: [], total: 0 });
const isLoading = ref(false);

export function useCart() {
  const { isLoggedIn, isAuthInitialized } = useAuth();
  const { addNotification } = useNotifications();

  const fetchCart = async () => {
    if (!isAuthInitialized.value) return;
    isLoading.value = true;
    try {
      const response = await cartService.getCart();
      cart.value = response.data && Array.isArray(response.data.itens) 
                   ? response.data 
                   : { itens: [], total: 0 };
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error);
      cart.value = { itens: [], total: 0 };
    } finally {
      isLoading.value = false;
    }
  };
  
  watch(isAuthInitialized, (initialized) => {
    if (initialized) fetchCart();
  }, { immediate: true });
  
  watch(isLoggedIn, async (loggedIn, wasLoggedIn) => {
    if (loggedIn && wasLoggedIn === false) {
      console.log("Migrando carrinho...");
      await cartService.migrateCart();
      await fetchCart();
    } else if (!loggedIn && wasLoggedIn === true) {
      await fetchCart();
    }
  });

  const adicionarAoCarrinho = async (produto, quantidade = 1, variacaoId = null) => {
    if (!produto || !produto.id) return;
    isLoading.value = true;
    try {
      const response = await cartService.addToCart(produto.id, quantidade, variacaoId);
      cart.value = response.data;
      addNotification({ message: 'Produto adicionado!', type: 'success' });
    } catch (error) {
      addNotification({ message: 'Erro ao adicionar produto.', type: 'error' });
    } finally {
      isLoading.value = false;
    }
  };
  
  const removerDoCarrinho = async (produtoId, variacaoId) => {
    const response = await cartService.removeItem(produtoId, variacaoId);
    cart.value = response.data;
  };

  const atualizarQuantidade = async (produtoId, variacaoId, quantidade) => {
    if (quantidade <= 0) {
      await removerDoCarrinho(produtoId, variacaoId);
      return;
    }
    const response = await cartService.updateItem(produtoId, quantidade, variacaoId);
    cart.value = response.data;
  };

  return {
    cart: computed(() => cart.value?.itens || []),
    itemCount: computed(() => cart.value?.itens?.reduce((acc, item) => acc + item.quantidade, 0) || 0),
    subtotal: computed(() => cart.value?.itens?.reduce((acc, item) => acc + (item.preco * item.quantidade), 0) || 0),
    isLoading: computed(() => isLoading.value),
    adicionarAoCarrinho,
    removerDoCarrinho,
    atualizarQuantidade,
  };
}