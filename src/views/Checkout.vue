<template>
  <div class="checkout-page">
    <div class="container">
      <div class="breadcrumb">
        <router-link to="/" class="breadcrumb-item">Home</router-link>
        <span class="breadcrumb-separator">/</span>
        <router-link to="/carrinho" class="breadcrumb-item">Carrinho</router-link>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-item active"> Checkout</span>
      </div>

      <div class="checkout-content">
        <div class="checkout-form">
          <section v-if="isDigitalOnlyOrder" class="checkout-section digital-order-info">
            <div class="digital-message">
              <font-awesome-icon icon="envelope" class="icon" />
              <h2>Produtos Digitais</h2>
              <p>Seu pedido contém apenas produtos digitais. Após a confirmação do pagamento, você receberá os arquivos no e-mail cadastrado.</p>
            </div>
          </section>

          <section v-else class="checkout-section">
            <h2>Endereço de Entrega</h2>
            
            <div v-if="savedAddresses.length > 0" class="saved-addresses-section">
                <h4>Selecione um endereço salvo</h4>
                <div class="saved-addresses-list">
                    <div
                        v-for="address in savedAddresses"
                        :key="address.id"
                        class="saved-address-card"
                        :class="{ active: selectedAddressId === address.id }"
                        @click="selectSavedAddress(address)"
                    >
                        <div class="address-card-radio"></div>
                        <div class="address-card-info">
                          <p>{{ address.rua }}, {{ address.numero || 'S/N' }}</p>
                            <p>{{ address.cidade }} - {{ address.estado }} / CEP: {{ address.cep }}</p>
                        </div>
                    </div>
                </div>
                 <p class="text-center my-3">ou preencha um novo endereço abaixo</p>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="name">Nome Completo</label>
                <input
                  type="text"
                  id="name"
                  v-model="form.name"
                  placeholder="Nome do destinatário"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="document">CPF ou CNPJ</label>
                <input
                  type="text"
                  id="document"
                  v-model="form.document"
                  @input="formatDocument"
                  placeholder="___.___.___-__"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="cep">CEP</label>
                <input
                  type="text"
                  id="cep"
                  v-model="form.cep"
                  @input="formatCep"
                  @blur="searchCep"
                  maxlength="9"
                  placeholder="00000-000"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="street">Rua</label>
                <input type="text" id="street" v-model="form.street" placeholder="Nome da rua" />
              </div>

              <div class="form-group small">
                <label for="number">Número</label>
                <input type="text" id="number" v-model="form.number" placeholder="123" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="complement">Complemento (opcional)</label>
                <input
                  type="text"
                  id="complement"
                  v-model="form.complement"
                  placeholder="Apto, Bloco, etc"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="neighborhood">Bairro</label>
                <input
                  type="text"
                  id="neighborhood"
                  v-model="form.neighborhood"
                  placeholder="Nome do bairro"
                />
              </div>

              <div class="form-group">
                <label for="city">Cidade</label>
                <input type="text" id="city" v-model="form.city" placeholder="Nome da cidade" />
              </div>

              <div class="form-group small">
                <label for="state">Estado</label>
                <select id="state" v-model="form.state">
                  <option value="">UF</option>
                  <option v-for="state in states" :key="state" :value="state">
                    {{ state }}
                  </option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <button 
                class="btn btn-primary" 
                @click.prevent="calculateShipping"
                :disabled="!form.cep || !form.city || !form.state"
              >
                Calcular Frete
              </button>
            </div>
          </section>

          <section v-if="!isDigitalOnlyOrder && shippingOptions.length > 0" class="checkout-section">
            <h2>Método de Envio</h2>
            <div class="shipping-options">
              <div
                v-for="option in filteredShippingOptions"
                :key="option.id"
                class="shipping-option"
                :class="{ active: selectedShippingId === option.id }"
                @click="selectShipping(option)"
              >
                <div class="shipping-option-radio">
                  <div class="radio-inner"></div>
                </div>
                <div class="shipping-option-info">
                  <strong>{{ option.name }}</strong>
                  <template v-if="option.custom && parseFloat(option.price) === 0">
                    - Grátis
                  </template>
                  <template v-else>
                    - R$ {{ formatPrice(option.price) }}
                  </template>
                  <small> (Prazo: {{ option.delivery_time }} dias úteis)</small>
                </div>
              </div>
            </div>
          </section>

     
        </div>

        <div class="order-summary">
          <h2>Resumo do Pedido</h2>

          <div class="order-items">
            <div v-for="item in orderItems" :key="item.id" class="order-item">
            
              <div class="item-info">
                <h4>{{ item.title }}</h4>
                <p>{{ item.quantity }}x R$ {{ formatPrice(item.price) }}</p>
              </div>
              <div class="item-total">R$ {{ formatPrice(item.price * item.quantity) }}</div>
            </div>
          </div>

          <div class="summary-row">
            <span>Subtotal</span>
            <span>R$ {{ formatPrice(subtotal) }}</span>
          </div>

          <div class="summary-row">
            <span>Frete</span>
            <span>{{ shipping > 0 ? `R$ ${formatPrice(shipping)}` : 'Grátis' }}</span>
          </div>

          <div class="summary-row discount" v-if="discount > 0">
            <span>Desconto</span>
            <span>-R$ {{ formatPrice(discount) }}</span>
          </div>

          <div class="summary-row total">
            <span>Total</span>
            <span>R$ {{ formatPrice(total) }}</span>
          </div>

          <button
            class="btn btn-primary btn-lg btn-block"
            @click="placeOrder"
            :disabled="!isFormValid"
          >
            Finalizar Pedido
          </button>
        </div>
      </div>
    </div>

    <loading-modal v-if="placingOrder"></loading-modal>
  </div>
</template>

<script>
import { useCart } from '@/composables/useCart'
import orderService from '@/services/orderService'
import paymentService from '@/services/paymentService'
import addressService from '@/services/addressService'
import freteService from '@/services/freteService'
import LoadingModal from '@/components/LoadingModal.vue'

export default {
  name: 'Checkout',

  components: {
    LoadingModal,
  },

  setup() {
    const { cart, loading, fetchCart, itemCount, clearCart } = useCart()

    return {
      cart,
      loading,
      fetchCart,
      itemCount,
      clearCart,
    }
  },

  data() {
    return {
      form: {
        name: '',
        document: '',
        cep: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        cardNumber: '',
        cardName: '',
        cardExpiry: '',
        cardCvv: '',
        installments: 1,
      },
      states: [
        'AC',
        'AL',
        'AP',
        'AM',
        'BA',
        'CE',
        'DF',
        'ES',
        'GO',
        'MA',
        'MT',
        'MS',
        'MG',
        'PA',
        'PB',
        'PR',
        'PE',
        'PI',
        'RJ',
        'RN',
        'RS',
        'RO',
        'RR',
        'SC',
        'SP',
        'SE',
        'TO',
      ],
      shipping: 0,
      discount: 0,
      placingOrder: false,
      shippingOptions: [],
      selectedShippingId: null,
      savedAddresses: [],
      selectedAddressId: null,
    }
  },
  computed: {
    isDigitalOnlyOrder() {
      return this.cart && this.cart.itens && this.cart.itens.length > 0 && 
        this.cart.itens.every(item => {
          // Verifica se o item tem uma variação específica
          if (item.variacaoId) {
            const variacao = item.produto.variacoes?.find(v => v.id === item.variacaoId);
            return variacao?.digital;
          }
          return false;
        });
    },
    orderItems() {
      if (!this.cart || !Array.isArray(this.cart.itens)) return []
      return this.cart.itens
        .map(item => {
          const produto = item.produto && typeof item.produto === 'object' ? item.produto : item
          if (!produto || !produto.id) return null
          return {
            id: produto.id,
            title: produto.nome,
            price: parseFloat(item.preco),
            quantity: item.quantidade,
            image:
              produto.imagens && produto.imagens.length > 0
                ? produto.imagens[0]
                : 'https://via.placeholder.com/60',
          }
        })
        .filter(item => item !== null)
    },
    subtotal() {
      const itemsTotal = this.orderItems.reduce(
        (total, item) => total + (item.price || 0) * (item.quantity || 0),
        0
      )
      if (this.cart && parseFloat(this.cart.subtotal) > itemsTotal) {
        return parseFloat(this.cart.subtotal)
      }
      return itemsTotal
    },
    total() {
      const calc = this.subtotal + this.shipping - this.discount
      if (this.cart && parseFloat(this.cart.total) > calc) {
        return parseFloat(this.cart.total)
      }
      return calc > 0 ? calc : 0
    },
    installmentOptions() {
      const options = []
      for (let i = 1; i <= 12; i++) {
        const value = this.total / i
        options.push({
          value: i,
          label: `${i}x de R$ ${this.formatPrice(value)}${i === 1 ? ' à vista' : ''}`,
        })
      }
      return options
    },
    isFormValid() {
      if (this.isDigitalOnlyOrder) return true
      return (
        this.form.name &&
        this.form.cep &&
        this.form.street &&
        this.form.number &&
        this.form.city &&
        this.form.state &&
        this.selectedShippingId
      )
    },
    filteredShippingOptions() {
      return this.shippingOptions.filter(opt => {
        if (opt.custom) return true;
        return parseFloat(opt.price) > 0;
      });
    },
  },
  watch: {
    selectedAddressId(newId, oldId) {
      if (newId && newId !== oldId && !this.isDigitalOnlyOrder) {
        this.calculateShipping();
      }
    },
    'form.cep'(newCep) {
      // Remove caracteres não numéricos
      const cepNumerico = newCep.replace(/\D/g, '');
      
      // Se o CEP tem 8 dígitos, busca o endereço
      if (cepNumerico.length === 8) {
        this.searchCep();
      } else if (cepNumerico.length > 8) {
        // Se passou de 8 dígitos, corta o excesso
        this.form.cep = cepNumerico.slice(0, 8);
      }
    }
  },
  methods: {
    formatPrice(value) {
      const num = parseFloat(value) || 0
      return num.toFixed(2).replace('.', ',')
    },
    formatDocument(event) {
      let value = event.target.value.replace(/\D/g, '')

      if (value.length > 14) {
        value = value.substring(0, 14)
      }

      if (value.length <= 11) {
        // CPF
        value = value.replace(/(\d{3})(\d)/, '$1.$2')
        value = value.replace(/(\d{3})(\d)/, '$1.$2')
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
      } else {
        // CNPJ
        value = value.replace(/^(\d{2})(\d)/, '$1.$2')
        value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        value = value.replace(/\.(\d{3})(\d)/, '.$1/$2')
        value = value.replace(/(\d{4})(\d)/, '$1-$2')
      }

      this.form.document = value
    },
    formatCep(event) {
      let value = event.target.value.replace(/\D/g, '');
      
      if (value.length > 8) {
        value = value.slice(0, 8);
      }
      
      if (value.length >= 5) {
        value = value.replace(/(\d{5})(\d{0,3})/, '$1-$2');
      }
      
      this.form.cep = value;
    },
    async searchCep() {
      // Remove caracteres não numéricos
      const cepNumerico = this.form.cep.replace(/\D/g, '');
      
      if (cepNumerico.length === 8) {
        try {
          const data = await addressService.getCep(cepNumerico)
          if (data) {
            this.form.street = data.logradouro || ''
            this.form.neighborhood = data.bairro || ''
            this.form.city = data.localidade || ''
            this.form.state = data.uf || ''
            
            // Formata o CEP com máscara
            this.form.cep = cepNumerico.replace(/(\d{5})(\d{3})/, '$1-$2');
            
            // Só calcula o frete se tiver itens no carrinho
            if (this.orderItems.length > 0) {
              this.getShippingOptions()
            }
          }
        } catch (err) {
          console.error('Erro ao buscar CEP', err)
          this.$emit('error', {
            title: 'Erro ao buscar CEP',
            message: 'Não foi possível encontrar o endereço para este CEP. Verifique se o CEP está correto.'
          });
        }
      }
    },
    async getShippingOptions() {
      // Não calcula frete para pedidos digitais
      if (this.isDigitalOnlyOrder) {
          this.shippingOptions = [];
          return;
      }

      // Verifica se tem endereço salvo ou se o formulário tem CEP preenchido
      if (!this.selectedAddressId && !this.form.cep) {
          this.shippingOptions = [];
          return;
      }

      try {
        const originAddress = { cep: '01001000' }
        const destinationAddress = { cep: this.form.cep }

        const itemsPayload = this.orderItems.map(item => ({
          produtoId: item.id,
          quantidade: item.quantity,
          peso: item.peso || 0.5,
          altura: item.altura || 10,
          largura: item.largura || 10,
          comprimento: item.comprimento || 10,
        }))

        const response = await freteService.calcularFrete({
          enderecoOrigem: originAddress,
          enderecoDestino: destinationAddress,
          itens: itemsPayload,
        })

        this.shippingOptions = Array.isArray(response) ? response : response.options || []
        this.selectedShippingId = null
        this.shipping = 0
      } catch (err) {
        console.error('Erro ao calcular frete', err)
        this.shippingOptions = []
      }
    },
    selectShipping(option) {
      this.selectedShippingId = option.id
      this.shipping = parseFloat(option.price)
    },
    async fetchSavedAddresses() {
        try {
            this.savedAddresses = await addressService.getAddresses();
        } catch(err) {
            console.error("Erro ao buscar endereços salvos", err);
        }
    },
    selectSavedAddress(address) {
        this.selectedAddressId = address.id;
        this.form.name = address.nome || '';
        this.form.document = address.documento || '';
        this.form.cep = address.cep || '';
        this.form.street = address.rua || '';
        this.form.number = address.numero || '';
        this.form.complement = address.complemento || '';
        this.form.neighborhood = address.bairro || '';
        this.form.city = address.cidade || '';
        this.form.state = address.estado || '';
        
        // Após selecionar o endereço, recalcular o frete
        if(this.form.cep) {
            this.getShippingOptions();
        }
    },
    async placeOrder() {
      if (!this.isFormValid) return;

      this.placingOrder = true;

      try {
        // Se não tiver endereço selecionado e não for pedido digital, salva o endereço primeiro
        let enderecoEntregaId = this.selectedAddressId;
        if (!this.isDigitalOnlyOrder && !enderecoEntregaId) {
          const enderecoResponse = await addressService.createAddress({
            nome: this.form.name,
            documento: this.form.document,
            cep: this.form.cep,
            rua: this.form.street,
            numero: this.form.number,
            complemento: this.form.complement,
            bairro: this.form.neighborhood,
            cidade: this.form.city,
            estado: this.form.state
          });
          enderecoEntregaId = enderecoResponse.id;
        }

        const orderData = {
          enderecoEntregaId: this.isDigitalOnlyOrder ? null : enderecoEntregaId,
          freteId: this.isDigitalOnlyOrder ? null : this.selectedShippingId,
          itens: this.orderItems.map((item) => ({
            produtoId: item.id,
            quantidade: item.quantity,
            preco: item.price,
          }))
        };

        const orderResponse = await orderService.createOrder(orderData);
        const orderId = orderResponse.id;

        // Redireciona para o Mercado Pago
        const paymentResponse = await paymentService.checkout(orderId);
        
        // Limpa o carrinho antes de redirecionar
        await this.clearCart();
        
        // Redireciona para a URL do Mercado Pago (usando sandboxUrl para ambiente de desenvolvimento)
        window.location.href = paymentResponse.sandboxUrl || paymentResponse.checkoutUrl;
      } catch (error) {
        console.error('Erro ao finalizar pedido:', error);
        this.$emit('error', {
          title: 'Erro ao finalizar o pedido',
          message: error.response?.data?.erro || 'Não foi possível finalizar o pedido. Tente novamente.'
        });
      } finally {
        this.placingOrder = false;
      }
    },
    async calculateShipping() {
      if (!this.form.cep || !this.form.city || !this.form.state) {
        this.$emit('error', {
          title: 'Dados incompletos',
          message: 'Por favor, preencha o CEP, cidade e estado para calcular o frete.'
        });
        return;
      }

      try {
        this.$emit('loading', true);
        await this.getShippingOptions();
        
        if (this.shippingOptions.length === 0) {
          this.$emit('error', {
            title: 'Nenhum método de envio disponível',
            message: 'Não encontramos métodos de envio disponíveis para o endereço informado.'
          });
        }
      } catch (error) {
        console.error('Erro ao calcular frete:', error);
        this.$emit('error', {
          title: 'Erro ao calcular frete',
          message: 'Não foi possível calcular o frete. Por favor, tente novamente.'
        });
      } finally {
        this.$emit('loading', false);
      }
    },
  },
  async created() {
    await this.fetchCart(true)
    await this.fetchSavedAddresses()

    if (this.form.cep) {
      this.getShippingOptions()
    }
  },
}
</script>

<style lang="scss">
@use 'sass:color';

.checkout-page {
  padding: $spacing-xl 0;
}

.checkout-content {
  margin-top: $spacing-xl;
  display: grid;
  grid-template-columns: 1fr;
  gap: $spacing-xl;

  @include respond-to('lg') {
    grid-template-columns: 2fr 1fr;
  }
}

.checkout-section {
  @include card-base;
  margin-bottom: $spacing-xl;

  h2 {
    font-size: $font-size-xl;
    margin-bottom: $spacing-lg;
  }
}

.form-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: $spacing-md;
  margin-bottom: $spacing-md;

  @include respond-to('sm') {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));

    .form-group.small {
      max-width: 120px;
    }
  }
}

.form-group {
  label {
    display: block;
    margin-bottom: $spacing-xs;
    color: color.adjust(#2d3748, $lightness: 20%);
  }

  input,
  select {
    width: 100%;
    height: 40px;
    padding: 0 $spacing-sm;
    border: 1px solid $light;
    border-radius: $border-radius-sm;

    &:focus {
      border-color: $primary;
      outline: none;
    }
  }
}

.payment-methods {
  margin-bottom: $spacing-lg;
}

.payment-method {
  @include flex(row, flex-start, center);
  gap: $spacing-md;
  padding: $spacing-md;
  border: 1px solid $light;
  border-radius: $border-radius-sm;
  cursor: pointer;
  margin-bottom: $spacing-sm;
  transition: all 0.2s ease;

  &:hover {
    border-color: $primary;
  }

  &.active {
    border-color: $primary;
    background-color: color.adjust($primary, $lightness: 35%);

    .payment-method-radio {
      .radio-inner {
        transform: scale(1);
      }
    }
  }

  .payment-method-radio {
    width: 20px;
    height: 20px;
    border: 2px solid $primary;
    border-radius: 50%;
    @include flex(row, center, center);

    .radio-inner {
      width: 10px;
      height: 10px;
      background-color: $primary;
      border-radius: 50%;
      transform: scale(0);
      transition: transform 0.2s ease;
    }
  }

  .payment-method-info {
    @include flex(row, flex-start, center);
    gap: $spacing-sm;

    svg {
      color: $primary;
    }
  }
}

.credit-card-form {
  margin-top: $spacing-lg;
}

.pix-info,
.boleto-info {
  margin-top: $spacing-lg;
  padding: $spacing-md;
  background-color: color.adjust($light, $lightness: 2%);
  border-radius: $border-radius-sm;

  p {
    margin-bottom: $spacing-sm;

    &:last-child {
      margin-bottom: 0;
    }

    &.warning {
      color: $warning;
    }
  }
}

.order-summary {
  @include card-base;
  position: sticky;
  top: $spacing-xl;

  h2 {
    font-size: $font-size-xl;
    margin-bottom: $spacing-lg;
  }

  .order-items {
    margin-bottom: $spacing-lg;

    .order-item {
      @include flex(row, flex-start, center);
      gap: $spacing-md;
      padding-bottom: $spacing-md;
      margin-bottom: $spacing-md;
      border-bottom: 1px solid $light;

      &:last-child {
        border-bottom: none;
      }

      .item-image {
        width: 60px;
        aspect-ratio: 3/4;
        border-radius: $border-radius-sm;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .item-info {
        flex: 1;

        h4 {
          font-size: $font-size-base;
          margin-bottom: $spacing-xs;
        }

        p {
          color: color.adjust(#2d3748, $lightness: 30%);
          font-size: $font-size-sm;
        }
      }

      .item-total {
        font-weight: 500;
      }
    }
  }

  .summary-row {
    @include flex(row, space-between, center);
    margin-bottom: $spacing-sm;

    &.discount {
      color: $danger;
    }

    &.total {
      font-size: $font-size-lg;
      font-weight: 600;
      margin: $spacing-md 0;
      padding-top: $spacing-md;
      border-top: 1px solid $light;
    }
  }
}

.shipping-options {
  margin-bottom: $spacing-lg;
}
.shipping-option {
  @include flex(row, flex-start, center);
  gap: $spacing-md;
  padding: $spacing-md;
  border: 1px solid $light;
  border-radius: $border-radius-sm;
  cursor: pointer;
  margin-bottom: $spacing-sm;
  transition: all 0.2s ease;

  &:hover {
    border-color: $primary;
  }

  &.active {
    border-color: $primary;
    background-color: color.adjust($primary, $lightness: 35%);

    .shipping-option-radio .radio-inner {
      transform: scale(1);
    }
  }

  .shipping-option-radio {
    width: 20px;
    height: 20px;
    border: 2px solid $primary;
    border-radius: 50%;
    @include flex(row, center, center);

    .radio-inner {
      width: 10px;
      height: 10px;
      background-color: $primary;
      border-radius: 50%;
      transform: scale(0);
      transition: transform 0.2s ease;
    }
  }

  .shipping-option-info {
    strong {
      margin-right: $spacing-sm;
    }
    small {
      color: gray;
    }
  }
}

.saved-addresses-section {
    margin-bottom: $spacing-xl;
}

.saved-addresses-list {
    display: grid;
    grid-template-columns: 1fr;
    gap: $spacing-md;
    
    @include respond-to('md') {
        grid-template-columns: 1fr 1fr;
    }
}

.saved-address-card {
    display: flex;
    align-items: flex-start;
    gap: $spacing-md;
    padding: $spacing-md;
    border: 1px solid $light;
    border-radius: $border-radius-md;
    cursor: pointer;
    transition: all 0.2s ease;

    .address-card-radio {
        width: 20px;
        height: 20px;
        border: 2px solid $primary;
        border-radius: 50%;
        margin-top: 5px;
        position: relative;
        flex-shrink: 0;

        &::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0);
            width: 10px;
            height: 10px;
            background: $primary;
            border-radius: 50%;
            transition: transform 0.2s ease;
        }
    }

    .address-card-info {
        p {
            font-size: $font-size-sm;
            color: gray;
            margin: 0;
        }
        strong {
            display: block;
            margin-bottom: $spacing-xs;
        }
    }

    &:hover {
        border-color: $primary;
    }

    &.active {
        border-color: $primary;
        background-color: color.adjust($primary, $lightness: 35%);

        .address-card-radio::after {
            transform: translate(-50%, -50%) scale(1);
        }
    }
}

.digital-order-info {
  background-color: $primary-light-20;
  border-radius: $border-radius-lg;
  padding: $spacing-xl;
  margin-bottom: $spacing-xl;

  .digital-message {
    text-align: center;

    .icon {
      font-size: 2.5rem;
      color: $primary;
      margin-bottom: $spacing-md;
    }

    h2 {
      color: $primary;
      margin-bottom: $spacing-sm;
    }

    p {
      color: $dark-50;
      line-height: 1.6;
      max-width: 600px;
      margin: 0 auto;
    }
  }
}
</style>
