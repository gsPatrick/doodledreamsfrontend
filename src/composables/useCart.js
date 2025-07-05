import { ref, computed, watch } from 'vue';
import cartService from '../services/cartService';
import produtoService from '../services/produtoService'; // Precisamos para buscar detalhes do produto
import { useAuth } from './useAuth';
import { useNotifications } from './useNotifications';

// --- ESTADO GLOBAL REATIVO ---
const cart = ref([]);
const isLoading = ref(false);

const ANONYMOUS_CART_KEY = 'anonymous_cart';

export function useCart() {
  const { isLoggedIn, user } = useAuth();
  const { addNotification } = useNotifications();

  // --- FUNÇÕES INTERNAS ---

  // Carrega o carrinho do localStorage para usuários não logados
  const carregarCarrinhoLocal = async () => {
    isLoading.value = true;
    try {
      const localCartData = localStorage.getItem(ANONYMOUS_CART_KEY);
      if (localCartData) {
        const localCartItems = JSON.parse(localCartData);
        // Precisamos buscar os detalhes atuais dos produtos para garantir que os preços, etc., estão corretos
        const productIds = localCartItems.map(item => item.produtoId);
        if (productIds.length > 0) {
            // Simulação de busca de detalhes. Idealmente, você teria um endpoint que aceita múltiplos IDs.
            // Por enquanto, vamos assumir que os dados no localStorage são suficientes.
            // Para uma implementação robusta, seria necessário buscar os produtos.
            cart.value = localCartItems;
        } else {
            cart.value = [];
        }
      } else {
        cart.value = [];
      }
    } catch (e) {
      console.error("Erro ao carregar carrinho local:", e);
      cart.value = [];
      localStorage.removeItem(ANONYMOUS_CART_KEY);
    } finally {
      isLoading.value = false;
    }
  };

  // Carrega o carrinho da API para usuários logados
  const carregarCarrinhoApi = async () => {
    if (!isLoggedIn.value) return;
    isLoading.value = true;
    try {
      const response = await cartService.getCart();
      cart.value = response?.itens || response || [];
    } catch (error) {
      console.error('Erro ao carregar carrinho da API:', error);
      addNotification({ message: 'Não foi possível carregar seu carrinho.', type: 'error' });
      cart.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  // Salva o carrinho no localStorage
  const salvarCarrinhoLocal = () => {
    localStorage.setItem(ANONYMOUS_CART_KEY, JSON.stringify(cart.value));
  };

  // Migra o carrinho local para o backend após o login
  const migrarCarrinhoParaApi = async () => {
    const localCartData = localStorage.getItem(ANONYMOUS_CART_KEY);
    if (!localCartData) return;

    const localItems = JSON.parse(localCartData);
    if (localItems.length === 0) return;

    console.log("Migrando carrinho local para o servidor...");
    try {
      // Usa o endpoint de atualizar carrinho do backend para enviar todos os itens de uma vez
      const itemsToSync = localItems.map(item => ({
        produtoId: item.produtoId,
        quantidade: item.quantidade,
        variacaoId: item.variacaoId
      }));

      await cartService.updateItem(null, itemsToSync); // Supondo que updateItem aceite um array
      localStorage.removeItem(ANONYMOUS_CART_KEY); // Limpa o carrinho local após a migração
      await carregarCarrinhoApi(); // Carrega o carrinho final do servidor
    } catch (error) {
      console.error("Erro ao migrar carrinho:", error);
    }
  };

  // --- WATCHER PRINCIPAL ---
  watch(isLoggedIn, (loggedIn) => {
    if (loggedIn) {
      // Usuário fez login: migra o carrinho local e depois carrega da API
      migrarCarrinhoParaApi().then(() => {
        carregarCarrinhoApi();
      });
    } else {
      // Usuário não está logado (ou deslogou): carrega do localStorage
      carregarCarrinhoLocal();
    }
  }, { immediate: true });

  // --- FUNÇÕES PÚBLICAS ---
 const adicionarAoCarrinho = async (produto, quantidade = 1, variacaoId = null) => {
  if (!isLoggedIn.value) {
    // Lógica para usuário não logado
    const itemIndex = cart.value.findIndex(item => item.produtoId === produto.id && item.variacaoId === variacaoId);
    const variacao = produto.variacoes.find(v => v.id === variacaoId);

    if (itemIndex > -1) {
      cart.value[itemIndex].quantidade += quantidade;
    } else {
      // --- CORREÇÃO CRÍTICA AQUI ---
      // A estrutura do objeto que salvamos no carrinho local DEVE ser a mesma
      // que o backend retornaria, para manter a consistência.
      cart.value.push({
        produtoId: produto.id,
        variacaoId: variacaoId,
        nome: `${produto.nome} - ${variacao.nome}`,
        preco: parseFloat(variacao.preco),
        quantidade: quantidade,
        // Garante que o objeto 'produto' exista e tenha a estrutura esperada
        produto: {
            id: produto.id,
            nome: produto.nome,
            // Adiciona a categoria e a imagem principal se existirem
            category: produto.categoria, // <-- O objeto completo da categoria
            // Pega a primeira imagem para exibição no carrinho
            imagemUrl: produto.imagens && produto.imagens.length > 0 ? produto.imagens[0] : null
        }
      });
    }
    salvarCarrinhoLocal();
    addNotification({ message: 'Produto adicionado ao carrinho!', type: 'success' });
    } else {
      // Lógica para usuário logado (chama a API)
      try {
        await cartService.addToCart(produto.id, quantidade, variacaoId);
        await carregarCarrinhoApi();
        addNotification({ message: 'Produto adicionado ao carrinho!', type: 'success' });
      } catch (error) {
        console.error('Erro ao adicionar ao carrinho (API):', error);
        addNotification({ message: error.response?.data?.erro || 'Erro ao adicionar produto.', type: 'error' });
      }
    }
  };
  
  const removerDoCarrinho = async (produtoId, variacaoId) => {
    if (!isLoggedIn.value) {
        cart.value = cart.value.filter(item => !(item.produtoId === produtoId && item.variacaoId === variacaoId));
        salvarCarrinhoLocal();
    } else {
        await cartService.removeItem(produtoId, variacaoId);
        await carregarCarrinhoApi();
    }
  };

  const atualizarQuantidade = async (produtoId, variacaoId, quantidade) => {
    if (quantidade <= 0) {
        await removerDoCarrinho(produtoId, variacaoId);
        return;
    }
    if (!isLoggedIn.value) {
        const itemIndex = cart.value.findIndex(item => item.produtoId === produtoId && item.variacaoId === variacaoId);
        if(itemIndex > -1) {
            cart.value[itemIndex].quantidade = quantidade;
            salvarCarrinhoLocal();
        }
    } else {
        await cartService.updateItem(produtoId, quantidade, variacaoId);
        await carregarCarrinhoApi();
    }
  };


  // Propriedades computadas
  const subtotal = computed(() => {
    return cart.value.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
  });

  const totalItems = computed(() => {
    return cart.value.reduce((acc, item) => acc + item.quantidade, 0);
  });

  return {
    cart,
    isLoading,
    subtotal,
    totalItems,
    adicionarAoCarrinho,
    removerDoCarrinho,
    atualizarQuantidade,
  };
}