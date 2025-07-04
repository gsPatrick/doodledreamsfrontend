import { ref, computed } from 'vue'
import { useAuth } from './useAuth'
import { useGhostSignup } from './useGhostSignup'
import { useNotifications } from './useNotifications'
import cartService from '../services/cartService'

export function useCart() {
  const { user } = useAuth()
  const { openGhostSignup } = useGhostSignup()
  const { addNotification } = useNotifications()
  const cart = ref([])
  const isLoading = ref(false)

  const total = computed(() => {
    return cart.value.reduce((acc, item) => {
      return acc + (item.preco * item.quantidade)
    }, 0)
  })

  const totalItems = computed(() => {
    return cart.value.reduce((acc, item) => acc + item.quantidade, 0)
  })

  const carregarCarrinho = async () => {
    if (!user.value) return
    
    try {
      isLoading.value = true
      const response = await cartService.getCart()
      cart.value = response
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error)
      addNotification({
        message: 'Erro ao carregar carrinho',
        type: 'error'
      })
    } finally {
      isLoading.value = false
    }
  }

  const adicionarAoCarrinho = async (produto, quantidade = 1) => {
    if (!user.value) {
      openGhostSignup(() => adicionarAoCarrinho(produto, quantidade))
      return
    }

    try {
      isLoading.value = true
      await cartService.addToCart(produto.id, quantidade, produto.variacaoId)
      await carregarCarrinho()
      addNotification({
        message: 'Produto adicionado ao carrinho',
        type: 'success'
      })
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error)
      addNotification({
        message: 'Erro ao adicionar ao carrinho',
        type: 'error'
      })
    } finally {
      isLoading.value = false
    }
  }

  const removerDoCarrinho = async (produtoId, variacaoId) => {
    if (!user.value) return

    try {
      isLoading.value = true
      await cartService.removeFromCart(produtoId, variacaoId)
      await carregarCarrinho()
      addNotification({
        message: 'Produto removido do carrinho',
        type: 'success'
      })
    } catch (error) {
      console.error('Erro ao remover do carrinho:', error)
      addNotification({
        message: 'Erro ao remover do carrinho',
        type: 'error'
      })
    } finally {
      isLoading.value = false
    }
  }

  const atualizarQuantidade = async (produtoId, variacaoId, quantidade) => {
    if (!user.value) return

    try {
      isLoading.value = true
      await cartService.updateQuantity(produtoId, variacaoId, quantidade)
      await carregarCarrinho()
    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error)
      addNotification({
        message: 'Erro ao atualizar quantidade',
        type: 'error'
      })
    } finally {
      isLoading.value = false
    }
  }

  const limparCarrinho = async () => {
    if (!user.value) return

    try {
      isLoading.value = true
      await cartService.clearCart()
      cart.value = []
    } catch (error) {
      console.error('Erro ao limpar carrinho:', error)
      addNotification({
        message: 'Erro ao limpar carrinho',
        type: 'error'
      })
    } finally {
      isLoading.value = false
    }
  }

  // Alias para manter compatibilidade
  const fetchCart = carregarCarrinho;

  return {
    cart,
    isLoading,
    total,
    totalItems,
    carregarCarrinho,
    fetchCart,
    adicionarAoCarrinho,
    removerDoCarrinho,
    atualizarQuantidade,
    limparCarrinho
  }
} 