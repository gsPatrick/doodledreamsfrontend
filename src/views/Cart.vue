<template>
  <div class="cart-page">
    <div class="container">
    

      <h1 class="page-title">Meu Carrinho</h1>

      <div v-if="loading" class="loading-cart">
        <div class="loading-spinner">
          <font-awesome-icon icon="spinner" spin />
        </div>
        <p>Carregando seu carrinho...</p>
      </div>

      <div v-else-if="cartItems.length === 0" class="empty-cart">
        <div class="empty-cart-icon">
          <font-awesome-icon icon="shopping-cart" />
        </div>
        <h2>Seu carrinho está vazio</h2>
        <p>Adicione produtos ao seu carrinho para continuar.</p>
        <router-link to="/catalogo" class="btn btn-primary">
          Explorar Catálogo
        </router-link>
      </div>

      <div v-else class="cart-content">
        <div class="cart-items">
          <div class="cart-header">
            <div class="cart-header-product">Produto</div>
            <div class="cart-header-price">Preço</div>
            <div class="cart-header-quantity">Quantidade</div>
            <div class="cart-header-total">Total</div>
            <div class="cart-header-actions"></div>
          </div>

          <div v-for="item in cartItems" :key="item.id" class="cart-item">
            <CartItem :item="item" @update-quantity="updateQuantity" @remove-item="removeItem" />
          </div>
        </div>

        <div class="cart-sidebar">
          <div class="cart-summary">
            <h3 class="summary-title">Resumo do Pedido</h3>

            <div class="summary-row">
              <span>Subtotal</span>
              <span>R$ {{ formatPrice(subtotal) }}</span>
            </div>

            <div class="summary-row" v-if="discount > 0">
              <span>Desconto</span>
              <span>- R$ {{ formatPrice(discount) }}</span>
            </div>

            <div class="summary-row shipping">
              <span>Frete</span>
              <span v-if="freeShipping">Grátis</span>
              <span v-else>Calculado no checkout</span>
            </div>

            <div class="summary-row total">
              <span>Total</span>
              <span>R$ {{ formatPrice(total) }}</span>
            </div>

            <div class="summary-actions">
              <router-link to="/checkout" class="btn btn-primary btn-block">
                Finalizar Compra
              </router-link>
              <router-link to="/catalogo" class="btn btn-outline btn-block">
                Continuar Comprando
              </router-link>
            </div>
          </div>

          <div class="coupon-form">
            <h3 class="coupon-title">Cupom de Desconto</h3>
            <form @submit.prevent="applyCoupon">
              <div class="form-group">
                <input type="text" v-model="couponCode" placeholder="Digite seu cupom" class="form-control">
              </div>
              <button type="submit" class="btn btn-secondary btn-block">
                Aplicar Cupom
              </button>
            </form>
            <div v-if="couponMessage" class="coupon-message" :class="{ error: couponError }">
              {{ couponMessage }}
            </div>
          </div>
        </div>
      </div>

      <!-- Produtos Recomendados -->
      <div v-if="cartItems.length > 0" class="cart-recommendations">
        <ProductRecommendations title="Recomendados para você" subtitle="Baseado nos itens do seu carrinho"
          :produtos="recommendedProducts" @add-to-cart="addToCart" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import debounce from 'lodash/debounce';
import CartItem from '@/components/CartItem.vue';
import ProductRecommendations from '@/components/ProductRecommendations.vue';
import cartService from '@/services/cartService';
import produtoService from '@/services/produtoService';
import api from '@/services/api';
import { useCart } from '@/composables/useCart';

export default {
  name: 'Cart',
  components: {
    CartItem,
    ProductRecommendations
  },
  setup() {
    const loading = ref(true);
    const cart = ref(null);
    const cartItems = ref([]);
    const recommendedProducts = ref([]);
    const couponCode = ref('');
    const couponMessage = ref('');
    const couponError = ref(false);
    const appliedCoupon = ref(null);
    const { fetchCart: refreshGlobalCart } = useCart();

    const formatPrice = (price) => {
      if (typeof price !== 'number') return '0,00';
      return price.toFixed(2).replace('.', ',');
    };
    
    const mapCartData = (data) => {
      if (!data || !Array.isArray(data.itens)) return [];
      return data.itens.map(item => {
        // Se o backend não devolve objeto produto completo, construir com dados mínimos
        const product = item.produto || {
          id: item.produtoId,
          nome: item.nome,
          preco: item.preco,
          imagens: [],
          categoria: null,
        };

        const imagens = Array.isArray(product.imagens) ? product.imagens : [];
        return {
          id: `${item.produtoId}-${item.variacaoId}`,
          productId: item.produtoId,
          variationId: item.variacaoId,
          product: {
            id: product.id,
            title: product.nome,
            price: parseFloat(product.preco),
            image: imagens.length ? imagens[0] : 'https://via.placeholder.com/150',
            category: product.categoria?.toString(),
          },
          quantity: item.quantidade || 1,
          price: parseFloat(item.preco)
        };
      });
    };

    const fetchCart = async () => {
      loading.value = true;
      try {
        const data = await cartService.getCart();
        cart.value = data;
        cartItems.value = mapCartData(data);
        
        if (cartItems.value.length > 0) {
          fetchRecommendations(cartItems.value[0].product.category);
        }

        // Atualiza o estado global do carrinho também
        refreshGlobalCart(true);

      } catch (error) {
        console.error("Erro ao buscar carrinho:", error);
      } finally {
        loading.value = false;
      }
    };
    
    const fetchRecommendations = async (categoryId) => {
        if (!categoryId) return;
        try {
            const data = await produtoService.getProdutos({ categoria: categoryId, limit: 5 });
            recommendedProducts.value = data.produtos.map(p => ({
                id: p.id,
                nome: p.nome,
                title: p.nome,
                preco: parseFloat(p.preco || 0),
                price: parseFloat(p.preco || 0),
                imagens: p.imagens || [],
                variacoes: p.variacoes || [],
                ArquivoProdutos: p.ArquivoProdutos || [],
                category: p.categoria?.toString(),
                categoria: p.categoria
            }));
        } catch (error) {
            console.error("Erro ao buscar recomendações:", error);
        }
    };

    const updateQuantity = debounce(async ({ productId, variationId, quantity }) => {
      try {
        await cartService.updateQuantity(productId, variationId, quantity);
        fetchCart();
        // Atualiza estado global
        refreshGlobalCart(true);
      } catch (error) {
        console.error("Erro ao atualizar quantidade:", error);
        alert('Não foi possível atualizar o item.');
      }
    }, 500);

    const removeItem = async ({ productId, variationId }) => {
      try {
        await cartService.removeFromCart(productId, variationId);
        fetchCart();
        refreshGlobalCart(true);
      } catch (error) {
        console.error("Erro ao remover item:", error);
        // Não exibir alerta aqui, pois já temos tratamento de erro no serviço
      }
    };

    const applyCoupon = async () => {
      if (!couponCode.value) {
        couponMessage.value = 'Por favor, digite um cupom.';
        couponError.value = true;
        return;
      }

      try {
        const response = await api.post('/api/cupons/validar', { codigo: couponCode.value });
        appliedCoupon.value = response.data;
        couponMessage.value = 'Cupom aplicado com sucesso!';
        couponError.value = false;
        fetchCart();
      } catch (error) {
        appliedCoupon.value = null;
        couponMessage.value = error.response?.data?.mensagem || 'Cupom inválido ou expirado.';
        couponError.value = true;
      }
    };
    
    const subtotal = computed(() => {
      if (cart.value && typeof cart.value.subtotal !== 'undefined') {
        return parseFloat(cart.value.subtotal);
      }
      // Fallback: soma dos itens
      return cartItems.value.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    });

    const discount = computed(() => {
      if (cart.value && typeof cart.value.desconto !== 'undefined') {
        return parseFloat(cart.value.desconto);
      }
      return 0;
    });

    const total = computed(() => {
      if (cart.value && typeof cart.value.total !== 'undefined') {
        return parseFloat(cart.value.total);
      }
      return subtotal.value - discount.value;
    });

    const freeShipping = computed(() => subtotal.value >= 150);

    onMounted(fetchCart);

    return {
      loading,
      cartItems,
      couponCode,
      couponMessage,
      couponError,
      recommendedProducts,
      subtotal,
      discount,
      total,
      freeShipping,
      formatPrice,
      updateQuantity,
      removeItem,
      applyCoupon,
    };
  }
};
</script>

<style lang="scss" scoped>
@use 'sass:color';
@use '@/assets/scss/variables' as *;
@use '@/assets/scss/mixins' as *;

.cart-page {
  padding: $spacing-xl 0;
  padding-top: 20px;
}

.page-title {
  font-size: $font-size-3xl;
  margin-bottom: $spacing-xl;
}

.loading-cart,
.empty-cart {
  text-align: center;
  padding: $spacing-2xl 0;
}

.loading-spinner {
  font-size: $font-size-3xl;
  color: $primary;
  margin-bottom: $spacing-md;
}

.empty-cart-icon {
  font-size: $font-size-4xl;
  color: color.adjust($dark, $lightness: 50%);
  margin-bottom: $spacing-md;
}

.cart-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: $spacing-xl;

  @include respond-to(lg) {
    grid-template-columns: 2fr 1fr;
  }
}

.cart-items {
  background-color: $white;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-md;
  overflow: hidden;
}

.cart-header {
  display: none;

  @include respond-to(md) {
    display: grid;
    grid-template-columns: 3fr 1fr 1fr 1fr 40px;
    padding: $spacing-md $spacing-lg;
    background-color: $light;
    font-weight: 600;
    color: $dark;
  }
}

.cart-sidebar {
  align-self: start;
}

.cart-summary {
  background-color: $white;
  border-radius: $border-radius-lg;
  padding: $spacing-lg;
  box-shadow: $shadow-md;
  margin-bottom: $spacing-lg;
}

.summary-title {
  font-size: $font-size-lg;
  margin-bottom: $spacing-lg;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 40px;
    height: 2px;
    background-color: $primary;
    border-radius: $border-radius-full;
  }
}

.summary-row {
  @include flex(row, space-between, center);
  margin-bottom: $spacing-sm;
  padding-bottom: $spacing-sm;
  border-bottom: 1px solid color.adjust($dark, $lightness: 80%);

  &:last-of-type {
    border-bottom: none;
  }

  &.shipping {
    color: color.adjust($dark, $lightness: 30%);
    font-size: $font-size-sm;
  }

  &.total {
    margin-top: $spacing-md;
    padding-top: $spacing-md;
    border-top: 1px solid color.adjust($dark, $lightness: 70%);
    border-bottom: none;
    font-weight: 700;
    font-size: $font-size-lg;

    span:last-child {
      color: $primary;
    }
  }
}

.summary-actions {
  margin-top: $spacing-lg;

  .btn {
    margin-bottom: $spacing-sm;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.coupon-form {
  background-color: $white;
  border-radius: $border-radius-lg;
  padding: $spacing-lg;
  box-shadow: $shadow-md;
}

.coupon-title {
  font-size: $font-size-lg;
  margin-bottom: $spacing-lg;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 40px;
    height: 2px;
    background-color: $primary;
    border-radius: $border-radius-full;
  }
}

.coupon-message {
  margin-top: $spacing-sm;
  padding: $spacing-xs $spacing-sm;
  border-radius: $border-radius-sm;
  font-size: $font-size-sm;
  background-color: rgba($accent, 0.1);
  color: $accent;

  &.error {
    background-color: rgba($danger, 0.1);
    color: $danger;
  }
}

.cart-recommendations {
  margin-top: $spacing-2xl;
}

.btn-block {
  width: 100%;
}
</style>
