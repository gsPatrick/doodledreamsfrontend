<template>
  <div class="cart-page">
    <div class="container">
      <h1>Meu Carrinho</h1>

      <!-- Estado de Carregamento -->
      <div v-if="isLoading" class="loading-cart">
        <font-awesome-icon icon="spinner" spin size="2x" />
        <p>Carregando seu carrinho...</p>
      </div>

      <!-- Carrinho Vazio -->
      <div v-else-if="!cart || cart.length === 0" class="empty-cart">
        <h2>Seu carrinho está vazio</h2>
        <p>Adicione produtos ao seu carrinho para continuar.</p>
        <router-link to="/catalogo" class="btn btn-primary">Explorar Catálogo</router-link>
      </div>

      <!-- Conteúdo do Carrinho -->
      <div v-else class="cart-content">
        <div class="row">
          <!-- Lista de Itens -->
          <div class="col-lg-8">
            <div class="cart-items-list">
              <div class="cart-header d-none d-md-flex">
                <div class="col-md-6">Produto</div>
                <div class="col-md-2 text-center">Preço</div>
                <div class="col-md-2 text-center">Quantidade</div>
                <div class="col-md-2 text-right">Total</div>
              </div>
              <!-- O componente CartItem agora recebe os dados e funções como props -->
              <CartItem
                v-for="item in cart"
                :key="item.produto.id + '-' + item.variacaoId"
                :item="item"
                @remove="removerDoCarrinho(item.produtoId, item.variacaoId)"
                @update-quantity="atualizarQuantidade(item.produtoId, item.variacaoId, $event)"
              />
            </div>
          </div>

          <!-- Resumo do Pedido -->
          <div class="col-lg-4">
            <div class="order-summary">
              <h3>Resumo do Pedido</h3>
              <div class="summary-line">
                <span>Subtotal</span>
                <span>R$ {{ formatPrice(subtotal) }}</span>
              </div>
              <div class="summary-line" v-if="discount > 0">
                <span>Desconto</span>
                <span class="text-success">- R$ {{ formatPrice(discount) }}</span>
              </div>
              <div class="summary-line">
                <span>Frete</span>
                <span>Calculado no checkout</span>
              </div>
              <hr />
              <div class="summary-total">
                <span>Total</span>
                <span>R$ {{ formatPrice(total) }}</span>
              </div>
              <router-link to="/checkout" class="btn btn-primary btn-block mt-3">Finalizar Compra</router-link>
              <router-link to="/catalogo" class="btn btn-outline-secondary btn-block mt-2">Continuar Comprando</router-link>
            </div>
            
            <!-- Cupom de Desconto -->
            <div class="coupon-section mt-4">
              <h3>Cupom de Desconto</h3>
              <div class="input-group">
                <input type="text" v-model="couponCode" class="form-control" placeholder="Digite seu cupom">
                <div class="input-group-append">
                  <button @click="applyCoupon" class="btn btn-secondary">Aplicar</button>
                </div>
              </div>
              <small v-if="couponMessage" class="coupon-message mt-2 d-block">{{ couponMessage }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'; // <-- ADICIONE 'ref' AQUI
import { useCart } from '@/composables/useCart'; // Importa nosso hook centralizado
import { useNotifications } from '@/composables/useNotifications';
import CartItem from '@/components/CartItem.vue'; // Supondo que você tenha um componente para o item

export default {
  name: 'Cart',
  components: {
    CartItem,
  },
  setup() {
    // 1. Chamar o composable para obter o estado e as funções GLOBAIS
    const { 
      cart, 
      isLoading, 
      subtotal, 
      removerDoCarrinho, 
      atualizarQuantidade,
      limparCarrinho 
    } = useCart();

    const { addNotification } = useNotifications();

    // 2. Lógica de cupom (pode ser movida para um composable 'useCoupon' no futuro)
    const couponCode = ref('');
    const couponMessage = ref('');
    const discount = ref(0); // Simulação de desconto

    const applyCoupon = () => {
      if (couponCode.value.toUpperCase() === 'DOODLE10') {
        discount.value = subtotal.value * 0.10;
        couponMessage.value = 'Cupom de 10% aplicado com sucesso!';
        addNotification({ message: couponMessage.value, type: 'success' });
      } else {
        discount.value = 0;
        couponMessage.value = 'Cupom inválido.';
        addNotification({ message: couponMessage.value, type: 'error' });
      }
    };

    // 3. Total final calculado
    const total = computed(() => {
      return subtotal.value - discount.value;
    });

    // 4. Funções de formatação e navegação
    const formatPrice = (value) => {
      if (typeof value !== 'number') return '0,00';
      return value.toFixed(2).replace('.', ',');
    };

    // Não precisamos mais de 'onMounted' para chamar 'fetchCart',
    // pois o 'useCart' já lida com isso através de um 'watch'.

    return {
      cart,
      isLoading,
      subtotal,
      discount,
      total,
      removerDoCarrinho,
      atualizarQuantidade,
      limparCarrinho,
      formatPrice,
      couponCode,
      couponMessage,
      applyCoupon,
    };
  },
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
