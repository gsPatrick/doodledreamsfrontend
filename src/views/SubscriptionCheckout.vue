<template>
    <div class="checkout-page">
        <div class="container">
            <div class="breadcrumb">
                <router-link to="/" class="breadcrumb-item">Home</router-link>
                <span class="breadcrumb-separator">/</span>
                <router-link to="/assinatura" class="breadcrumb-item">Planos</router-link>
                <span class="breadcrumb-separator">/</span>
                <span class="breadcrumb-item active">Finalizar Assinatura</span>
            </div>

            <div v-if="isLoading" class="loading-state">
                <p>Carregando...</p>
            </div>

            <div v-if="plano" class="checkout-content">
                <div class="checkout-form">
                    <section class="checkout-section">
                        <h2>Endereço de Entrega</h2>
                        <div v-if="savedAddresses.length > 0" class="saved-addresses-list">
                            <div v-for="address in savedAddresses" :key="address.id"
                                class="saved-address-card" :class="{ active: selectedAddressId === address.id }"
                                @click="selectAddress(address.id)">
                                <div class="address-card-radio"></div>
                                <div class="address-card-info">
                                    <strong>{{ address.nome || 'Endereço' }}</strong>
                                    <p>{{ address.rua }}, {{ address.numero || 'S/N' }}</p>
                                    <p>{{ address.cidade }} - {{ address.estado }} / CEP: {{ address.cep }}</p>
                                </div>
                            </div>
                        </div>
                        <p v-else>Nenhum endereço salvo. Por favor, adicione um endereço no seu <router-link to="/perfil">perfil</router-link>.</p>
                    </section>

                    <section v-if="shippingOptions.length > 0" class="checkout-section">
                        <h2>Método de Envio</h2>
                        <div class="shipping-options">
                            <div v-for="option in shippingOptions" :key="option.id" class="shipping-option"
                                :class="{ active: selectedShipping.id === option.id }" @click="selectShipping(option)">
                                <div class="shipping-option-radio"></div>
                                <div class="shipping-option-info">
                                    <strong>{{ option.name }}</strong> - R$ {{ formatPrice(option.price) }}
                                    <small> (Prazo: {{ option.delivery_time }} dias úteis)</small>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section class="checkout-section">
                        <h2>Pagamento Recorrente</h2>
                        <p>Você será redirecionado ao Mercado Pago para autorizar o pagamento recorrente com segurança após confirmar a assinatura.</p>
                    </section>
                </div>

                <div class="order-summary">
                    <h2>Resumo da Assinatura</h2>
                    <div class="order-items">
                        <div class="order-item">
                            <div class="item-info">
                                <h4>Plano: {{ plano.nome }}</h4>
                                <p>{{ plano.frequencia.charAt(0).toUpperCase() + plano.frequencia.slice(1) }}</p>
                            </div>
                            <div class="item-total">R$ {{ formatPrice(plano.preco) }}</div>
                        </div>
                    </div>
                    <div class="summary-row">
                        <span>Subtotal do Plano</span>
                        <span>R$ {{ formatPrice(plano.preco) }}</span>
                    </div>
                    <div class="summary-row">
                        <span>Frete</span>
                        <span>R$ {{ formatPrice(summary.shipping) }}</span>
                    </div>
                    <div class="summary-row total">
                        <span>Total Recorrente</span>
                        <span>R$ {{ formatPrice(summary.total) }}</span>
                    </div>
                    <button class="btn btn-primary btn-lg btn-block" @click="finalizeSubscription" :disabled="!canFinalize">
                        Assinar Agora
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import subscriptionService from '@/services/subscriptionService';
import addressService from '@/services/addressService';

export default {
    name: 'SubscriptionCheckout',
    data() {
        return {
            isLoading: true,
            plano: null,
            savedAddresses: [],
            selectedAddressId: null,
            shippingOptions: [],
            selectedShipping: {},
        };
    },
    computed: {
        summary() {
            const subtotal = parseFloat(this.plano?.preco || 0);
            const shipping = parseFloat(this.selectedShipping?.price || 0);
            const total = subtotal + shipping;
            return { subtotal, shipping, total };
        },
        canFinalize() {
            return this.selectedAddressId && this.selectedShipping.id;
        },
    },
    async created() {
        try {
            await this.fetchPlanoDetails();
            await this.fetchAddresses();
        } catch (error) {
            console.error("Erro ao carregar a página de checkout:", error);
        } finally {
            this.isLoading = false;
        }
    },
    methods: {
        async fetchPlanoDetails() {
            const planoId = this.$route.params.planoId;
            const response = await subscriptionService.getPlanDetails(planoId);
            this.plano = response.data;
        },
        async fetchAddresses() {
            const response = await addressService.getAddresses();
            this.savedAddresses = response.data;
            if (this.savedAddresses.length > 0) {
                this.selectAddress(this.savedAddresses[0].id);
            }
        },
        async selectAddress(addressId) {
            this.selectedAddressId = addressId;
            this.shippingOptions = [];
            this.selectedShipping = {};
            await this.calculateShipping();
        },
        async calculateShipping() {
            if (!this.selectedAddressId) return;
            try {
                const response = await subscriptionService.calculateShipping({
                    planoId: this.plano.id,
                    enderecoEntregaId: this.selectedAddressId,
                });
                this.shippingOptions = response.data;
            } catch (error) {
                console.error("Erro ao calcular frete:", error);
            }
        },
        selectShipping(option) {
            this.selectedShipping = option;
        },
        async finalizeSubscription() {
            if (!this.canFinalize) return;
            try {
                const response = await subscriptionService.subscribe({
                    planoId: this.plano.id,
                    enderecoEntregaId: this.selectedAddressId,
                    metodoFreteId: this.selectedShipping.id,
                });
                window.location.href = response.data.checkoutUrl;
            } catch (error) {
                console.error("Erro ao finalizar assinatura:", error);
            }
        },
        formatPrice(value) {
            if (typeof value !== 'number') {
                value = parseFloat(value) || 0;
            }
            return value.toFixed(2).replace('.', ',');
        },
    },
};
</script> 