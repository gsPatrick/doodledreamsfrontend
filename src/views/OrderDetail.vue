<template>
  <div class="order-detail-page">
    <div class="container">
      <div class="breadcrumb">
        <router-link to="/" class="breadcrumb-item">Home</router-link>
        <span class="breadcrumb-separator">/</span>
        <router-link to="/perfil" class="breadcrumb-item"> Meu Perfil</router-link>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-item active"> Detalhes do Pedido</span>
      </div>

      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Carregando detalhes do pedido...</p>
      </div>

      <div v-if="error" class="error-state">
        <h3>Erro ao carregar o pedido</h3>
        <p>{{ error }}</p>
        <router-link to="/perfil" class="btn btn-primary">Voltar aos Pedidos</router-link>
      </div>

      <div v-if="order && !loading" class="order-detail-container">
        <div class="order-header">
          <div>
            <h2 class="order-title">Pedido #{{ order.id }}</h2>
            <p class="order-date">Realizado em {{ formatDate(order.createdAt) }}</p>
          </div>
          <div class="order-status-wrapper">
            <span class="order-status" :class="order.status.toLowerCase()">{{ order.status }}</span>
            <button
              v-if="order.status === 'pendente'"
              @click="showCancelModal = true"
              class="btn btn-danger ml-3"
            >
              Cancelar Pedido
            </button>
          </div>
        </div>

        <!-- Modal de confirmação de cancelamento -->
        <div v-if="showCancelModal" class="modal-overlay">
          <div class="modal-content">
            <h3>Confirmar Cancelamento</h3>
            <p>Tem certeza que deseja cancelar este pedido?</p>
            <p class="modal-warning">Esta ação não pode ser desfeita.</p>
            <div class="modal-actions">
              <button
                class="btn btn-secondary"
                @click="showCancelModal = false"
                :disabled="cancelingOrder"
              >
                Não, manter pedido
              </button>
              <button class="btn btn-danger" @click="cancelOrder" :disabled="cancelingOrder">
                {{ cancelingOrder ? 'Cancelando...' : 'Sim, cancelar pedido' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Alerta chamativo de pagamento pendente -->
        <div v-if="order.status === 'pendente'" class="payment-alert">
          <p>Seu pedido ainda não foi pago. Conclua o pagamento para que possamos processá-lo!</p>
          <button class="btn btn-primary btn-lg" @click="goToPayment">Pagar Agora</button>
        </div>

        <div class="order-layout">
          <div class="order-main-content">
            <div class="card">
              <div class="card-header">
                <h4>Itens do Pedido</h4>
              </div>
              <div class="card-body">
                <div
                  v-for="item in order.itens"
                  :key="item.produtoId || item.nome"
                  class="order-item"
                >
                  <img
                    :src="getProductImage(item)"
                    @error="setFallbackImage"
                    :alt="item.nome"
                    class="item-image"
                  />
                  <div class="item-details">
                    <h5 class="item-name">{{ item.nome }}</h5>
                    <p class="item-quantity-price">
                      {{ item.quantidade }}x R$ {{ formatPrice(item.preco) }}
                    </p>
                  </div>
                  <div class="item-subtotal">
                    <p>R$ {{ formatPrice(item.subtotal) }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="card-header">
                <h4>Histórico de Status</h4>
              </div>
              <div class="card-body">
                <!-- Mock de histórico, idealmente viria do backend -->
                <ul class="status-history">
                  <li><strong>Pendente:</strong> {{ formatDate(order.createdAt) }}</li>
                </ul>
              </div>
            </div>
          </div>

          <div class="order-sidebar">
            <div class="card">
              <div class="card-header">
                <h4>Resumo Financeiro</h4>
              </div>
              <div class="card-body">
                <ul class="summary-list">
                  <li>
                    <span>Subtotal</span> <span>R$ {{ formatPrice(calculateSubtotal()) }}</span>
                  </li>
                  <li>
                    <span>Frete</span> <span>R$ {{ formatPrice(order.valorFrete) }}</span>
                  </li>
                  <li v-if="order.desconto > 0" class="discount">
                    <span>Desconto (Cupom)</span>
                    <span>- R$ {{ formatPrice(order.desconto) }}</span>
                  </li>
                  <li class="total">
                    <span>Total</span> <strong>R$ {{ formatPrice(order.total) }}</strong>
                  </li>
                </ul>
              </div>
            </div>

            <div class="card">
              <div class="card-header">
                <h4>Endereço de Entrega</h4>
              </div>
              <div class="card-body">
                <div class="address-details" v-if="order.enderecoEntrega">
                  <p>{{ order.enderecoEntrega.rua }}, {{ order.enderecoEntrega.numero }}</p>
                  <p v-if="order.enderecoEntrega.complemento">
                    {{ order.enderecoEntrega.complemento }}
                  </p>
                  <p>{{ order.enderecoEntrega.bairro }}</p>
                  <p>{{ order.enderecoEntrega.cidade }} - {{ order.enderecoEntrega.estado }}</p>
                  <p>CEP: {{ order.enderecoEntrega.cep }}</p>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="card-header">
                <h4>Informações de Frete</h4>
              </div>
              <div class="card-body">
                <!-- Mock, idealmente viria do backend -->
                <p><strong>Serviço:</strong> PAC</p>
                <p><strong>Prazo:</strong> 7 dias úteis</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import orderService from '@/services/orderService'
import produtoService from '@/services/produtoService'

export default {
  name: 'OrderDetail',
  data() {
    return {
      loading: true,
      order: null,
      error: null,
      cancelingOrder: false,
      showCancelModal: false,
    }
  },
  methods: {
    async fetchOrderDetails() {
      this.loading = true
      this.error = null
      try {
        const orderId = this.$route.params.id
        const response = await orderService.getOrderById(orderId)
        // anexar imagens dos produtos
        const itensComImagem = await Promise.all(
          response.itens.map(async item => {
            if (item.imagemUrl) return item
            if (!item.produtoId) return item
            try {
              const produto = await produtoService.getProdutoById(item.produtoId)
              const img =
                (produto.ArquivoProdutos &&
                  produto.ArquivoProdutos.find(f => f.tipo === 'imagem')) ||
                null
              if (img) {
                item.imagemUrl = img.url
              }
            } catch (e) {
              // ignora erro individual
            }
            return item
          })
        )
        response.itens = itensComImagem
        this.order = response
      } catch (err) {
        this.error = 'Não foi possível carregar os detalhes do pedido. Tente novamente mais tarde.'
        console.error('Erro ao buscar detalhes do pedido:', err)
      } finally {
        this.loading = false
      }
    },
    formatDate(dateString) {
      if (!dateString) return 'Data indisponível'
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }
      return new Date(dateString).toLocaleDateString('pt-BR', options)
    },
    formatPrice(value) {
      const num = parseFloat(value) || 0
      return num.toFixed(2).replace('.', ',')
    },
    setFallbackImage(event) {
      event.target.src = 'https://placehold.co/80x80/E2E8F0/4A5568?text=Error'
    },
    calculateSubtotal() {
      if (!this.order || !this.order.itens) return 0
      return this.order.itens.reduce((acc, item) => acc + parseFloat(item.subtotal), 0)
    },
    getProductImage(item) {
      if (item.imagemUrl) {
        return item.imagemUrl
      }
      return 'https://placehold.co/80x80/EFEFEF/333?text=Imagem'
    },
    goToPayment() {
      if (!this.order || !this.order.Pagamentos) return
      const payment = this.order.Pagamentos.find(p => p.status === 'pendente')
      if (!payment) return
      // tenta url direta
      if (payment.urlPagamento) {
        window.open(payment.urlPagamento, '_blank')
        return
      }
      // tenta init_point do MercadoPago
      const url = payment.dadosTransacao?.init_point || payment.dadosTransacao?.sandbox_init_point
      if (url) {
        window.open(url, '_blank')
      }
    },
    async cancelOrder() {
      this.cancelingOrder = true
      try {
        await orderService.cancelOrder(this.order.id)
        this.order.status = 'cancelado'
        this.showCancelModal = false
        this.$emit('show-notification', {
          type: 'success',
          message: 'Pedido cancelado com sucesso!',
        })
      } catch (error) {
        console.error('Erro ao cancelar pedido:', error)
        this.$emit('show-notification', {
          type: 'error',
          message: 'Não foi possível cancelar o pedido. Tente novamente mais tarde.',
        })
      } finally {
        this.cancelingOrder = false
      }
    },
  },
  created() {
    this.fetchOrderDetails()
  },
}
</script>

<style lang="scss" scoped>
@use 'sass:color';

.order-detail-page {
  padding: $spacing-xl 0;
  background-color: #f9fafb; // Um fundo leve para a página inteira
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 $spacing-md;
}

.breadcrumb {
  margin-bottom: $spacing-xl;
}

.loading-state,
.error-state {
  text-align: center;
  padding: $spacing-2xl;
  .spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border-left-color: $primary;
    animation: spin 1s ease infinite;
    margin: 0 auto $spacing-lg;
  }
}

.order-detail-container {
  .order-header {
    @include flex(row, space-between, center);
    margin-bottom: $spacing-xl;
    padding-bottom: $spacing-lg;
    border-bottom: 1px solid $light;

    .order-title {
      font-size: $font-size-2xl;
      color: $dark;
      margin: 0;
    }

    .order-date {
      color: gray;
      font-size: $font-size-md;
    }

    .order-status-wrapper {
      @include flex(row, flex-end, center);
      gap: $spacing-md;
    }

    .order-status {
      padding: $spacing-xs $spacing-md;
      border-radius: 10px;
      font-weight: 500;
      color: $white;
      text-transform: capitalize;

      &.pendente {
        background-color: $warning;
      }
      &.pago {
        background-color: $success;
      }
      &.cancelado {
        background-color: $danger;
      }
      &.processando {
        background-color: $info;
      }
      &.entregue {
        background-color: $primary;
      }
    }
  }

  .order-layout {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: $spacing-xl;
  }

  .card {
    background-color: $white;
    border-radius: $border-radius-lg;
    box-shadow: $shadow-sm;
    margin-bottom: $spacing-lg;

    .card-header {
      padding: $spacing-md;
      border-bottom: 1px solid $light;
      h4 {
        margin: 0;
        font-size: $font-size-lg;
        color: $dark;
      }
    }
    .card-body {
      padding: $spacing-md;
    }
  }

  .order-item {
    @include flex(row, flex-start, center);
    gap: $spacing-md;
    padding: $spacing-md 0;

    &:not(:last-child) {
      border-bottom: 1px solid $light;
    }

    .item-image {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: $border-radius-md;
    }
    .item-details {
      flex-grow: 1;
      .item-name {
        font-size: $font-size-md;
        font-weight: 500;
        margin-bottom: $spacing-xs;
      }
      .item-quantity-price {
        color: gray;
      }
    }
    .item-subtotal {
      font-weight: 500;
      color: $dark;
    }
  }

  .summary-list {
    list-style: none;
    padding: 0;
    li {
      @include flex(row, space-between, center);
      margin-bottom: $spacing-sm;
      &.discount {
        color: $success;
      }
      &.total {
        padding-top: $spacing-sm;
        border-top: 1px solid $light;
        font-size: $font-size-lg;
        strong {
          color: $dark;
        }
      }
    }
  }

  .address-details,
  .status-history,
  .shipping-info {
    p,
    li {
      color: gray;
      margin-bottom: $spacing-xs;
    }
  }

  .payment-alert {
    background-color: color.adjust($warning, $lightness: 45%);
    border-left: 4px solid $warning;
    padding: $spacing-md;
    margin-bottom: $spacing-lg;
    border-radius: $border-radius-md;
    @include flex(row, space-between, center);

    p {
      margin: 0;
      font-weight: 500;
      color: $dark;
    }
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.order-status-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #c82333;
  }

  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
}

.ml-3 {
  margin-left: 1rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  h3 {
    margin-top: 0;
    margin-bottom: 1rem;
    color: #2d3748;
  }

  p {
    margin-bottom: 1rem;
    color: #4a5568;
  }

  .modal-warning {
    color: #e53e3e;
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
  }
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-secondary {
  background-color: #718096;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #4a5568;
  }

  &:disabled {
    background-color: #a0aec0;
    cursor: not-allowed;
  }
}
</style>
