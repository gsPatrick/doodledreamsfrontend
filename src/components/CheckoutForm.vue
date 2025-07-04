<template>
  <div class="checkout-form">
    <div class="checkout-steps">
      <div class="step" :class="{ active: currentStep >= 1, completed: currentStep > 1 }">
        <div class="step-number">1</div>
        <div class="step-title">Endereço</div>
      </div>
      <div class="step-connector"></div>
      <div class="step" :class="{ active: currentStep >= 2, completed: currentStep > 2 }">
        <div class="step-number">2</div>
        <div class="step-title">Entrega</div>
      </div>
      <div class="step-connector"></div>
      <div class="step" :class="{ active: currentStep >= 3, completed: currentStep > 3 }">
        <div class="step-number">3</div>
        <div class="step-title">Pagamento</div>
      </div>
      <div class="step-connector"></div>
      <div class="step" :class="{ active: currentStep >= 4, completed: currentStep > 4 }">
        <div class="step-number">4</div>
        <div class="step-title">Confirmação</div>
      </div>
    </div>

    <!-- Etapa 1: Endereço -->
    <div v-if="currentStep === 1" class="checkout-step-content">
      <h3 class="step-content-title">Endereço de Entrega</h3>

      <form @submit.prevent="goToStep(2)">
        <div class="form-row">
          <div class="form-group col-12 col-md-6">
            <label for="name" class="form-label">Nome completo</label>
            <input type="text" id="name" v-model="address.name" class="form-control" required />
          </div>
          <div class="form-group col-12 col-md-6">
            <label for="phone" class="form-label">Telefone</label>
            <input
              type="tel"
              id="phone"
              v-model="address.phone"
              class="form-control"
              required
              @input="formatPhone"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group col-12 col-md-6">
            <label for="document" class="form-label">CPF ou CNPJ</label>
            <input
              type="text"
              id="document"
              v-model="address.document"
              class="form-control"
              placeholder="___.___.___-__ ou __.___.___/____-__"
              required
              @input="formatDocument"
            />
          </div>
          <div class="form-group col-12 col-md-6">
            <label for="zipcode" class="form-label">CEP</label>
            <div class="input-with-button">
              <input
                type="text"
                id="zipcode"
                v-model="address.zipcode"
                class="form-control"
                required
                maxlength="9"
                @input="formatZipcode"
              />
              <button type="button" class="btn btn-secondary btn-sm" @click="searchZipcode">
                Buscar
              </button>
            </div>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group col-12 col-md-8">
            <label for="street" class="form-label">Endereço</label>
            <input type="text" id="street" v-model="address.street" class="form-control" required />
          </div>
          <div class="form-group col-12 col-md-4">
            <label for="number" class="form-label">Número</label>
            <input type="text" id="number" v-model="address.number" class="form-control" required />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group col-12 col-md-4">
            <label for="complement" class="form-label">Complemento (opcional)</label>
            <input type="text" id="complement" v-model="address.complement" class="form-control" />
          </div>
          <div class="form-group col-12 col-md-8">
            <label for="neighborhood" class="form-label">Bairro</label>
            <input
              type="text"
              id="neighborhood"
              v-model="address.neighborhood"
              class="form-control"
              required
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group col-12 col-md-6">
            <label for="city" class="form-label">Cidade</label>
            <input type="text" id="city" v-model="address.city" class="form-control" required />
          </div>
          <div class="form-group col-12 col-md-6">
            <label for="state" class="form-label">Estado</label>
            <select id="state" v-model="address.state" class="form-control" required>
              <option value="">Selecione...</option>
              <option v-for="state in brazilianStates" :key="state.value" :value="state.value">
                {{ state.label }}
              </option>
            </select>
          </div>
        </div>

        <div class="form-actions">
          <router-link to="/carrinho" class="btn btn-outline">Voltar para o Carrinho</router-link>
          <button type="submit" class="btn btn-primary">Continuar para Entrega</button>
        </div>
      </form>
    </div>

    <!-- Etapa 2: Entrega -->
    <div v-if="currentStep === 2" class="checkout-step-content">
      <h3 class="step-content-title">Opções de Entrega</h3>

      <div class="shipping-options">
        <div
          v-for="option in shippingOptions"
          :key="option.id"
          class="shipping-option"
          :class="{ active: shipping.option === option.id }"
          @click="selectShippingOption(option.id)"
        >
          <div class="shipping-option-radio">
            <input
              type="radio"
              :id="`shipping-${option.id}`"
              :value="option.id"
              v-model="shipping.option"
              name="shipping-option"
            />
            <label :for="`shipping-${option.id}`"></label>
          </div>

          <div class="shipping-option-info">
            <div class="shipping-option-name">{{ option.name }}</div>
            <div class="shipping-option-description">{{ option.description }}</div>
          </div>

          <div class="shipping-option-price">
            <div class="shipping-price">
              {{ option.price === 0 ? 'Grátis' : `R$ ${formatPrice(option.price)}` }}
            </div>
            <div class="shipping-eta">{{ option.eta }}</div>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button type="button" class="btn btn-outline" @click="goToStep(1)">Voltar</button>
        <button
          type="button"
          class="btn btn-primary"
          @click="goToStep(3)"
          :disabled="!shipping.option"
        >
          Continuar para Pagamento
        </button>
      </div>
    </div>

    <!-- Etapa 3: Pagamento -->
    <div v-if="currentStep === 3" class="checkout-step-content">
      <h3 class="step-content-title">Forma de Pagamento</h3>

      <div class="payment-methods">
        <div class="payment-method-tabs">
          <button
            v-for="method in paymentMethods"
            :key="method.id"
            class="payment-method-tab"
            :class="{ active: payment.method === method.id }"
            @click="selectPaymentMethod(method.id)"
          >
            <font-awesome-icon :icon="method.icon" />
            {{ method.name }}
          </button>
        </div>

        <!-- Cartão de Crédito -->
        <div v-if="payment.method === 'credit-card'" class="payment-method-content">
          <div class="form-row">
            <div class="form-group col-12">
              <label for="card-number" class="form-label">Número do Cartão</label>
              <input
                type="text"
                id="card-number"
                v-model="payment.creditCard.number"
                class="form-control"
                placeholder="0000 0000 0000 0000"
                maxlength="19"
                @input="formatCardNumber"
                required
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group col-12">
              <label for="card-name" class="form-label">Nome no Cartão</label>
              <input
                type="text"
                id="card-name"
                v-model="payment.creditCard.name"
                class="form-control"
                placeholder="Como aparece no cartão"
                required
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group col-6">
              <label for="card-expiry" class="form-label">Validade</label>
              <input
                type="text"
                id="card-expiry"
                v-model="payment.creditCard.expiry"
                class="form-control"
                placeholder="MM/AA"
                maxlength="5"
                @input="formatCardExpiry"
                required
              />
            </div>
            <div class="form-group col-6">
              <label for="card-cvv" class="form-label">CVV</label>
              <input
                type="text"
                id="card-cvv"
                v-model="payment.creditCard.cvv"
                class="form-control"
                placeholder="123"
                maxlength="4"
                required
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group col-12">
              <label for="card-installments" class="form-label">Parcelas</label>
              <select
                id="card-installments"
                v-model="payment.creditCard.installments"
                class="form-control"
                required
              >
                <option
                  v-for="option in installmentOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Boleto -->
        <div v-if="payment.method === 'boleto'" class="payment-method-content">
          <div class="boleto-info">
            <p>
              <font-awesome-icon icon="info-circle" />
              O boleto será gerado após a confirmação do pedido e terá vencimento em 3 dias úteis.
            </p>
            <p>
              <font-awesome-icon icon="exclamation-triangle" />
              O pedido será processado somente após a confirmação do pagamento.
            </p>
          </div>

          <div class="form-row">
            <div class="form-group col-12">
              <label for="boleto-cpf" class="form-label">CPF/CNPJ do Pagador</label>
              <input
                type="text"
                id="boleto-cpf"
                v-model="payment.boleto.document"
                class="form-control"
                placeholder="000.000.000-00"
                @input="formatDocument"
                required
              />
            </div>
          </div>
        </div>

        <!-- Pix -->
        <div v-if="payment.method === 'pix'" class="payment-method-content">
          <div class="pix-info">
            <p>
              <font-awesome-icon icon="info-circle" />
              Um QR Code será gerado após a confirmação do pedido.
            </p>
            <p>
              <font-awesome-icon icon="clock" />
              O pagamento via PIX é processado instantaneamente.
            </p>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button type="button" class="btn btn-outline" @click="goToStep(2)">Voltar</button>
        <button
          type="button"
          class="btn btn-primary"
          @click="goToStep(4)"
          :disabled="!isPaymentValid"
        >
          Revisar Pedido
        </button>
      </div>
    </div>

    <!-- Etapa 4: Confirmação -->
    <div v-if="currentStep === 4" class="checkout-step-content">
      <h3 class="step-content-title">Revisar e Finalizar</h3>

      <div class="order-summary">
        <div class="summary-section">
          <h4 class="summary-title">Endereço de Entrega</h4>
          <div class="summary-content">
            <p>{{ address.name }}</p>
            <p>
              {{ address.street }}, {{ address.number }}
              {{ address.complement ? `- ${address.complement}` : '' }}
            </p>
            <p>{{ address.neighborhood }} - {{ address.city }}/{{ address.state }}</p>
            <p>CEP: {{ address.zipcode }}</p>
            <p>Telefone: {{ address.phone }}</p>
          </div>
        </div>

        <div class="summary-section">
          <h4 class="summary-title">Método de Entrega</h4>
          <div class="summary-content">
            <p>
              {{ getSelectedShippingOption.name }} -
              {{
                getSelectedShippingOption.price === 0
                  ? 'Grátis'
                  : `R$ ${formatPrice(getSelectedShippingOption.price)}`
              }}
            </p>
            <p>{{ getSelectedShippingOption.description }}</p>
            <p>{{ getSelectedShippingOption.eta }}</p>
          </div>
        </div>

        <div class="summary-section">
          <h4 class="summary-title">Forma de Pagamento</h4>
          <div class="summary-content">
            <p>{{ getSelectedPaymentMethod.name }}</p>
            <template v-if="payment.method === 'credit-card'">
              <p>Cartão terminado em {{ payment.creditCard.number.slice(-4) }}</p>
              <p>
                {{ payment.creditCard.installments }}x de R$
                {{ formatPrice(orderTotal / payment.creditCard.installments) }}
              </p>
            </template>
          </div>
        </div>

        <div class="summary-section">
          <h4 class="summary-title">Resumo do Pedido</h4>
          <div class="summary-content">
            <div class="summary-row">
              <span>Subtotal ({{ itemCount }} {{ itemCount === 1 ? 'item' : 'itens' }})</span>
              <span>R$ {{ formatPrice(subtotal) }}</span>
            </div>
            <div class="summary-row">
              <span>Frete</span>
              <span>{{
                getSelectedShippingOption.price === 0
                  ? 'Grátis'
                  : `R$ ${formatPrice(getSelectedShippingOption.price)}`
              }}</span>
            </div>
            <div class="summary-row total">
              <span>Total</span>
              <span>R$ {{ formatPrice(orderTotal) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button type="button" class="btn btn-outline" @click="goToStep(3)">Voltar</button>
        <button type="button" class="btn btn-primary" @click="placeOrder">Finalizar Compra</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CheckoutForm',
  props: {
    cartItems: {
      type: Array,
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    itemCount: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      currentStep: 1,
      address: {
        name: '',
        phone: '',
        document: '',
        zipcode: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
      },
      shipping: {
        option: null,
      },
      payment: {
        method: 'credit-card',
        creditCard: {
          number: '',
          name: '',
          expiry: '',
          cvv: '',
          installments: 1,
        },
        boleto: {
          document: '',
        },
      },
      brazilianStates: [
        { value: 'AC', label: 'Acre' },
        { value: 'AL', label: 'Alagoas' },
        { value: 'AP', label: 'Amapá' },
        { value: 'AM', label: 'Amazonas' },
        { value: 'BA', label: 'Bahia' },
        { value: 'CE', label: 'Ceará' },
        { value: 'DF', label: 'Distrito Federal' },
        { value: 'ES', label: 'Espírito Santo' },
        { value: 'GO', label: 'Goiás' },
        { value: 'MA', label: 'Maranhão' },
        { value: 'MT', label: 'Mato Grosso' },
        { value: 'MS', label: 'Mato Grosso do Sul' },
        { value: 'MG', label: 'Minas Gerais' },
        { value: 'PA', label: 'Pará' },
        { value: 'PB', label: 'Paraíba' },
        { value: 'PR', label: 'Paraná' },
        { value: 'PE', label: 'Pernambuco' },
        { value: 'PI', label: 'Piauí' },
        { value: 'RJ', label: 'Rio de Janeiro' },
        { value: 'RN', label: 'Rio Grande do Norte' },
        { value: 'RS', label: 'Rio Grande do Sul' },
        { value: 'RO', label: 'Rondônia' },
        { value: 'RR', label: 'Roraima' },
        { value: 'SC', label: 'Santa Catarina' },
        { value: 'SP', label: 'São Paulo' },
        { value: 'SE', label: 'Sergipe' },
        { value: 'TO', label: 'Tocantins' },
      ],
      shippingOptions: [
        {
          id: 'standard',
          name: 'Entrega Padrão',
          description: 'Entrega econômica para todo o Brasil',
          price: 15.9,
          eta: 'Entrega em 5 a 8 dias úteis',
        },
        {
          id: 'express',
          name: 'Entrega Expressa',
          description: 'Entrega rápida para capitais e regiões metropolitanas',
          price: 25.9,
          eta: 'Entrega em 2 a 3 dias úteis',
        },
        {
          id: 'free',
          name: 'Entrega Grátis',
          description: 'Para compras acima de R$ 150,00',
          price: 0,
          eta: 'Entrega em 5 a 8 dias úteis',
        },
      ],
      paymentMethods: [
        {
          id: 'credit-card',
          name: 'Cartão de Crédito',
          icon: 'credit-card',
        },
        {
          id: 'boleto',
          name: 'Boleto Bancário',
          icon: 'barcode',
        },
        {
          id: 'pix',
          name: 'PIX',
          icon: 'qrcode',
        },
      ],
    }
  },
  computed: {
    installmentOptions() {
      const options = []
      const maxInstallments = this.orderTotal >= 300 ? 6 : this.orderTotal >= 150 ? 3 : 1

      for (let i = 1; i <= maxInstallments; i++) {
        const value = i
        const installmentValue = this.orderTotal / i
        const label =
          i === 1
            ? `À vista - R$ ${this.formatPrice(installmentValue)}`
            : `${i}x de R$ ${this.formatPrice(installmentValue)} sem juros`

        options.push({ value, label })
      }

      return options
    },
    getSelectedShippingOption() {
      return this.shippingOptions.find(option => option.id === this.shipping.option) || {}
    },
    getSelectedPaymentMethod() {
      return this.paymentMethods.find(method => method.id === this.payment.method) || {}
    },
    orderTotal() {
      const shippingCost = this.getSelectedShippingOption.price || 0
      return this.subtotal + shippingCost
    },
    isPaymentValid() {
      if (this.payment.method === 'credit-card') {
        return (
          this.payment.creditCard.number.length === 19 &&
          this.payment.creditCard.name.trim() !== '' &&
          this.payment.creditCard.expiry.length === 5 &&
          this.payment.creditCard.cvv.trim() !== ''
        )
      } else if (this.payment.method === 'boleto') {
        return this.payment.boleto.document.length >= 14
      } else if (this.payment.method === 'pix') {
        return true
      }

      return false
    },
  },
  methods: {
    formatPrice(price) {
      return price.toFixed(2).replace('.', ',')
    },
    formatZipcode() {
      // Formatar CEP como 00000-000
      this.address.zipcode = this.address.zipcode.replace(/\D/g, '')
      if (this.address.zipcode.length > 5) {
        this.address.zipcode =
          this.address.zipcode.substring(0, 5) + '-' + this.address.zipcode.substring(5, 8)
      }
    },
    formatPhone() {
      // Formatar telefone como (00) 00000-0000
      this.address.phone = this.address.phone.replace(/\D/g, '')
      if (this.address.phone.length > 10) {
        this.address.phone =
          '(' +
          this.address.phone.substring(0, 2) +
          ') ' +
          this.address.phone.substring(2, 7) +
          '-' +
          this.address.phone.substring(7, 11)
      } else if (this.address.phone.length > 6) {
        this.address.phone =
          '(' +
          this.address.phone.substring(0, 2) +
          ') ' +
          this.address.phone.substring(2, 6) +
          '-' +
          this.address.phone.substring(6, 10)
      } else if (this.address.phone.length > 2) {
        this.address.phone =
          '(' + this.address.phone.substring(0, 2) + ') ' + this.address.phone.substring(2)
      }
    },
    formatCardNumber() {
      // Formatar número do cartão como 0000 0000 0000 0000
      this.payment.creditCard.number = this.payment.creditCard.number.replace(/\D/g, '')
      this.payment.creditCard.number = this.payment.creditCard.number.replace(
        /(\d{4})(?=\d)/g,
        '$1 '
      )
    },
    formatCardExpiry() {
      // Formatar validade como MM/AA
      this.payment.creditCard.expiry = this.payment.creditCard.expiry.replace(/\D/g, '')
      if (this.payment.creditCard.expiry.length > 2) {
        this.payment.creditCard.expiry =
          this.payment.creditCard.expiry.substring(0, 2) +
          '/' +
          this.payment.creditCard.expiry.substring(2, 4)
      }
    },
    formatDocument(event) {
      let value = event.target.value.replace(/\D/g, '')

      if (value.length > 14) {
        value = value.substring(0, 14)
      }

      if (value.length <= 11) {
        // CPF: 000.000.000-00
        value = value.replace(/(\d{3})(\d)/, '$1.$2')
        value = value.replace(/(\d{3})(\d)/, '$1.$2')
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
      } else {
        // CNPJ: 00.000.000/0000-00
        value = value.replace(/^(\d{2})(\d)/, '$1.$2')
        value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        value = value.replace(/\.(\d{3})(\d)/, '.$1/$2')
        value = value.replace(/(\d{4})(\d)/, '$1-$2')
      }

      event.target.value = value
      this.address.document = value
    },
    searchZipcode() {
      // Simulação de busca de CEP
      if (this.address.zipcode.length === 9) {
        // Simulando um CEP válido
        if (this.address.zipcode === '01310-200') {
          this.address.street = 'Avenida Paulista'
          this.address.neighborhood = 'Bela Vista'
          this.address.city = 'São Paulo'
          this.address.state = 'SP'
        } else {
          alert('CEP não encontrado. Por favor, preencha o endereço manualmente.')
        }
      } else {
        alert('Por favor, digite um CEP válido')
      }
    },
    goToStep(step) {
      this.currentStep = step
      window.scrollTo(0, 0)
    },
    selectShippingOption(optionId) {
      this.shipping.option = optionId
    },
    selectPaymentMethod(methodId) {
      this.payment.method = methodId
    },
    placeOrder() {
      // Simulação de finalização do pedido
      this.$emit('order-placed', {
        address: this.address,
        shipping: {
          option: this.getSelectedShippingOption,
          cost: this.getSelectedShippingOption.price,
        },
        payment: {
          method: this.getSelectedPaymentMethod,
          details: this.payment[this.payment.method],
        },
        items: this.cartItems,
        subtotal: this.subtotal,
        total: this.orderTotal,
      })
    },
  },
  mounted() {
    // Verificar se o subtotal é maior que R$ 150 para habilitar frete grátis
    if (this.subtotal >= 150) {
      this.shipping.option = 'free'
    } else {
      this.shipping.option = 'standard'
    }
  },
}
</script>

<style lang="scss">
.checkout-form {
  margin-bottom: $spacing-2xl;
}

.checkout-steps {
  @include flex(row, space-between, center);
  margin-bottom: $spacing-xl;
  padding: $spacing-md 0;
}

.step {
  @include flex(column, center, center);
  position: relative;
  z-index: 1;

  &.active {
    .step-number {
      background-color: $primary;
      color: #ffffff;
    }

    .step-title {
      color: $primary;
      font-weight: 600;
    }
  }

  &.completed {
    .step-number {
      background-color: $accent;
      color: #ffffff;

      &::after {
        content: '\f00c'; // Font Awesome check icon
        font-family: 'Font Awesome 5 Free';
        font-weight: 900;
      }
    }
  }
}

.step-number {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: lighten(#2d3748, 60%);
  color: #2d3748;
  @include flex(row, center, center);
  margin-bottom: $spacing-xs;
  font-weight: 600;
  transition: $transition-base;
}

.step-title {
  font-size: $font-size-sm;
  color: lighten(#2d3748, 20%);
  transition: $transition-base;
}

.step-connector {
  flex-grow: 1;
  height: 2px;
  background-color: lighten(#2d3748, 60%);
  margin: 0 $spacing-sm;
  position: relative;
  top: -15px;
  z-index: 0;
}

.checkout-step-content {
  background-color: #ffffff;
  border-radius: $border-radius-lg;
  padding: $spacing-xl;
  box-shadow: $shadow-md;
}

.step-content-title {
  font-size: $font-size-xl;
  margin-bottom: $spacing-lg;
  color: #2d3748;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 60px;
    height: 2px;
    background-color: $primary;
    border-radius: $border-radius-full;
  }
}

.form-row {
  @include flex(row, flex-start, stretch);
  flex-wrap: wrap;
  margin: 0 -$spacing-sm;

  .form-group {
    padding: 0 $spacing-sm;
    margin-bottom: $spacing-md;
  }

  .col-12 {
    width: 100%;
  }

  .col-6 {
    width: 50%;
  }

  .col-4 {
    width: 33.333%;
  }

  .col-8 {
    width: 66.666%;
  }

  @media (max-width: $breakpoint-md - 1) {
    .col-md-4,
    .col-md-6,
    .col-md-8 {
      width: 100%;
    }
  }
}

.input-with-button {
  @include flex(row, flex-start, center);

  .form-control {
    flex-grow: 1;
    margin-right: $spacing-xs;
  }
}

.form-actions {
  @include flex(row, space-between, center);
  margin-top: $spacing-xl;

  @media (max-width: $breakpoint-sm - 1) {
    flex-direction: column;

    .btn {
      width: 100%;
      margin-bottom: $spacing-sm;
    }
  }
}

.shipping-options {
  margin-bottom: $spacing-lg;
}

.shipping-option {
  @include flex(row, flex-start, center);
  padding: $spacing-md;
  border: 1px solid lighten(#2d3748, 70%);
  border-radius: $border-radius-md;
  margin-bottom: $spacing-md;
  cursor: pointer;
  transition: $transition-base;

  &:hover {
    border-color: lighten($primary, 20%);
    background-color: rgba($primary, 0.05);
  }

  &.active {
    border-color: $primary;
    background-color: rgba($primary, 0.1);
  }
}

.shipping-option-radio {
  margin-right: $spacing-md;

  input[type='radio'] {
    display: none;
  }

  label {
    display: block;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid lighten(#2d3748, 50%);
    position: relative;
    cursor: pointer;

    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0);
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: $primary;
      transition: transform 0.2s ease;
    }
  }

  input[type='radio']:checked + label {
    border-color: $primary;

    &::after {
      transform: translate(-50%, -50%) scale(1);
    }
  }
}

.shipping-option-info {
  flex-grow: 1;
}

.shipping-option-name {
  font-weight: 600;
  margin-bottom: $spacing-xs;
}

.shipping-option-description {
  font-size: $font-size-sm;
  color: lighten(#2d3748, 20%);
}

.shipping-option-price {
  text-align: right;
}

.shipping-price {
  font-weight: 600;
  color: $primary;
}

.shipping-eta {
  font-size: $font-size-xs;
  color: lighten(#2d3748, 30%);
}

.payment-method-tabs {
  @include flex(row, flex-start, center);
  margin-bottom: $spacing-lg;
  border-bottom: 1px solid lighten(#2d3748, 70%);

  @media (max-width: $breakpoint-sm - 1) {
    flex-direction: column;
    border-bottom: none;
  }
}

.payment-method-tab {
  padding: $spacing-sm $spacing-md;
  margin-right: $spacing-md;
  font-weight: 500;
  color: lighten(#2d3748, 20%);
  position: relative;
  transition: $transition-base;

  svg {
    margin-right: $spacing-xs;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 0;
    height: 2px;
    background-color: $primary;
    transition: width 0.3s ease;
  }

  &:hover {
    color: $primary;
  }

  &.active {
    color: $primary;

    &::after {
      width: 100%;
    }
  }

  @media (max-width: $breakpoint-sm - 1) {
    width: 100%;
    text-align: left;
    padding: $spacing-md;
    margin-right: 0;
    margin-bottom: $spacing-xs;
    border: 1px solid lighten(#2d3748, 70%);
    border-radius: $border-radius-md;

    &.active {
      background-color: rgba($primary, 0.1);
      border-color: $primary;
    }

    &::after {
      display: none;
    }
  }
}

.payment-method-content {
  padding: $spacing-md 0;
}

.boleto-info,
.pix-info {
  background-color: rgba($secondary, 0.1);
  border-radius: $border-radius-md;
  padding: $spacing-md;
  margin-bottom: $spacing-lg;

  p {
    margin-bottom: $spacing-sm;

    &:last-child {
      margin-bottom: 0;
    }

    svg {
      color: $secondary;
      margin-right: $spacing-xs;
    }
  }
}

.order-summary {
  margin-bottom: $spacing-xl;
}

.summary-section {
  margin-bottom: $spacing-lg;

  &:last-child {
    margin-bottom: 0;
  }
}

.summary-title {
  font-size: $font-size-md;
  margin-bottom: $spacing-sm;
  color: #2d3748;
}

.summary-content {
  background-color: $light;
  border-radius: $border-radius-md;
  padding: $spacing-md;

  p {
    margin-bottom: $spacing-xs;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.summary-row {
  @include flex(row, space-between, center);
  margin-bottom: $spacing-xs;

  &:last-child {
    margin-bottom: 0;
  }

  &.total {
    margin-top: $spacing-sm;
    padding-top: $spacing-sm;
    border-top: 1px solid lighten(#2d3748, 70%);
    font-weight: 700;
    font-size: $font-size-md;

    span:last-child {
      color: $primary;
    }
  }
}
</style>
