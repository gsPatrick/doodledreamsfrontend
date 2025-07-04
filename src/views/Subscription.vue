<template>
    <div class="subscription-page">
        <div class="container">
            <div class="breadcrumb">
                <router-link to="/" class="breadcrumb-item">Home</router-link>
                <span class="breadcrumb-separator">/</span>
                <span class="breadcrumb-item active"> Planos de Assinatura</span>
            </div>

            <div class="subscription-header">
                <h1>Escolha seu Plano</h1>
                <p>Acesse nossa biblioteca completa de livros digitais</p>
            </div>

           

            <div class="subscription-plans">
                <div v-for="plan in plans" :key="plan.id" class="plan-card" :class="{
                    'popular': plan.popular,
                    'selected': selectedPlan === plan.id
                }" @click="selectPlan(plan.id)">
                    <div class="plan-popular" v-if="plan.popular">Mais Popular</div>

                    <div class="plan-header">
                        <h3>{{ plan.name }}</h3>
                        <p>{{ plan.description }}</p>
                    </div>

                    <div class="plan-price">
                        <div class="price-amount">
                            <span class="currency">R$</span>
                            <span class="amount">{{ formatPrice(plan.preco) }}</span>
                            <span class="period">/{{ plan.frequencia === 'anual' ? 'ano' : 'mês' }}</span>
                        </div>
                    </div>

                    <ul class="plan-features">
                        <li v-for="(feature, index) in plan.features" :key="index" class="feature-item">
                            <font-awesome-icon icon="check" class="feature-icon" />
                            {{ feature }}
                        </li>
                    </ul>

                    <button class="btn btn-lg" :class="plan.popular ? 'btn-primary' : 'btn-outline'"
                        @click.stop="subscribeToPlan(plan.id)">
                        {{ plan.popular ? 'Começar Agora' : 'Selecionar Plano' }}
                    </button>
                </div>
            </div>

            <div class="subscription-features">
                <h2>Todos os planos incluem</h2>

                <div class="features-grid">
                    <div class="feature-card">
                        <div class="feature-icon">
                            <font-awesome-icon icon="book-open" />
                        </div>
                        <h3>Acesso Ilimitado</h3>
                        <p>Leia quantos livros quiser, quando quiser</p>
                    </div>

                    <div class="feature-card">
                        <div class="feature-icon">
                            <font-awesome-icon icon="mobile-alt" />
                        </div>
                        <h3>Leitura Offline</h3>
                        <p>Baixe os livros para ler sem internet</p>
                    </div>

                    <div class="feature-card">
                        <div class="feature-icon">
                            <font-awesome-icon icon="sync" />
                        </div>
                        <h3>Sincronização</h3>
                        <p>Continue a leitura de onde parou em qualquer dispositivo</p>
                    </div>

                    <div class="feature-card">
                        <div class="feature-icon">
                            <font-awesome-icon icon="headphones" />
                        </div>
                        <h3>Audiobooks</h3>
                        <p>Escute seus livros favoritos onde estiver</p>
                    </div>
                </div>
            </div>

            <div class="subscription-faq">
                <h2>Perguntas Frequentes</h2>

                <div class="faq-list">
                    <div v-for="(item, index) in faqItems" :key="index" class="faq-item"
                        :class="{ active: activeFaq === index }">
                        <div class="faq-question" @click="toggleFaq(index)">
                            <span>{{ item.question }}</span>
                            <font-awesome-icon :icon="activeFaq === index ? 'minus' : 'plus'" class="faq-icon" />
                        </div>
                        <div class="faq-answer" v-show="activeFaq === index">
                            {{ item.answer }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import subscriptionService from '../services/subscriptionService';

export default {
    name: 'Subscription',
    data() {
        return {
            selectedPlan: null,
            activeFaq: null,
            plans: [],
            faqItems: [
                {
                    question: 'Posso cancelar a qualquer momento?',
                    answer: 'Sim, você pode cancelar sua assinatura a qualquer momento. Se você cancelar, manterá o acesso até o final do período pago.'
                },
                {
                    question: 'Como funciona o período de teste?',
                    answer: 'Oferecemos 7 dias de teste grátis em todos os planos. Você pode cancelar antes do final do período de teste e não será cobrado.'
                },
                {
                    question: 'Posso mudar de plano depois?',
                    answer: 'Sim, você pode fazer upgrade ou downgrade do seu plano a qualquer momento. A diferença será calculada proporcionalmente.'
                },
                {
                    question: 'Os livros podem ser lidos offline?',
                    answer: 'Sim, você pode baixar os livros para ler offline em seus dispositivos. O número de downloads simultâneos depende do seu plano.'
                }
            ]
        }
    },
    async created() {
        await this.fetchPlans();
    },
    methods: {
        async fetchPlans() {
            try {
                const response = await subscriptionService.getPlans();
                this.plans = response.data.map(plan => ({
                    ...plan,
                    popular: plan.nome.toLowerCase().includes('premium'),
                    features: plan.descricao ? plan.descricao.split(', ') : [],
                }));
            } catch (error) {
                console.error("Erro ao buscar planos:", error);
            }
        },
        formatPrice(value) {
            if (typeof value !== 'number') {
                value = parseFloat(value) || 0;
            }
            return value.toFixed(2).replace('.', ',')
        },
        selectPlan(planId) {
            this.selectedPlan = planId
        },
        subscribeToPlan(planId) {
            this.$router.push(`/assinatura/checkout/${planId}`);
        },
        toggleFaq(index) {
            this.activeFaq = this.activeFaq === index ? null : index
        }
    }
}
</script>

<style lang="scss">
.subscription-page {
    padding: $spacing-xl 0;
}

.subscription-header {
    text-align: center;
    margin-bottom: $spacing-2xl;

    h1 {
        font-size: $font-size-3xl;
        margin-bottom: $spacing-sm;
    }

    p {
        font-size: $font-size-lg;
        color: $dark-30;
    }
}

.subscription-toggle {
    @include flex(row, center, center);
    gap: $spacing-md;
    margin-bottom: $spacing-2xl;

    span {
        color: $dark-30;

        &.active {
            color: $primary;
            font-weight: 500;
        }
    }

    .toggle {
        position: relative;
        display: inline-block;
        width: 60px;
        height: 32px;

        input {
            opacity: 0;
            width: 0;
            height: 0;

            &:checked+.slider {
                background-color: $primary;

                &:before {
                    transform: translateX(28px);
                }
            }
        }

        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: $light;
            transition: 0.4s;
            border-radius: 34px;

            &:before {
                position: absolute;
                content: "";
                height: 24px;
                width: 24px;
                left: 4px;
                bottom: 4px;
                background-color: #ffffff;
                transition: 0.4s;
                border-radius: 50%;
            }
        }
    }

    .discount-badge {
        background-color: $success;
        color: #ffffff;
        padding: $spacing-xs $spacing-sm;
        border-radius: $border-radius-full;
        font-size: $font-size-sm;
        font-weight: 500;
    }
}

.subscription-plans {
    display: grid;
    grid-template-columns: 1fr;
    gap: $spacing-lg;
    margin-bottom: $spacing-2xl;

    @include respond-to('md') {
        grid-template-columns: repeat(3, 1fr);
    }
}

.plan-card {
    @include card-base;
    position: relative;
    padding: $spacing-xl;
    text-align: center;
    transition: transform 0.3s ease;
    cursor: pointer;

    &:hover {
        transform: translateY(-4px);
    }

    &.popular {
        border: 2px solid $primary;

        .plan-popular {
            position: absolute;
            top: 0;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: $primary;
            color: #ffffff;
            padding: $spacing-xs $spacing-md;
            border-radius: $border-radius-full;
            font-size: $font-size-sm;
            font-weight: 500;
        }
    }

    &.selected {
        border-color: $primary;
        background-color: $primary-light-35;
    }

    .plan-header {
        margin-bottom: $spacing-xl;

        h3 {
            font-size: $font-size-xl;
            margin-bottom: $spacing-xs;
        }

        p {
            color: $dark-30;
        }
    }

    .plan-price {
        margin-bottom: $spacing-xl;

        .price-amount {
            @include flex(row, center, baseline);
            gap: 2px;

            .currency {
                font-size: $font-size-lg;
                font-weight: 500;
            }

            .amount {
                font-size: $font-size-3xl;
                font-weight: 600;
                color: $primary;
            }

            .period {
                color: $dark-30;
            }
        }
    }

    .plan-features {
        list-style: none;
        padding: 0;
        margin: 0 0 $spacing-xl;

        .feature-item {
            @include flex(row, center, flex-start);
            gap: $spacing-sm;
            margin-bottom: $spacing-sm;
            text-align: left;

            .feature-icon {
                color: $success;
            }
        }
    }
}

.subscription-features {
    text-align: center;
    margin-bottom: $spacing-2xl;

    h2 {
        font-size: $font-size-2xl;
        margin-bottom: $spacing-xl;
        color: $dark;
    }
}

.features-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: $spacing-lg;

    @include respond-to('sm') {
        grid-template-columns: repeat(2, 1fr);
    }

    @include respond-to('lg') {
        grid-template-columns: repeat(4, 1fr);
    }
}

.feature-card {
    @include card-base;
    text-align: center;
    padding: $spacing-xl;

    .feature-icon {
        @include flex(row, center, center);
        width: 64px;
        height: 64px;
        margin: 0 auto $spacing-lg;
        background-color: $primary-light-35;
        border-radius: 50%;

        svg {
            font-size: 24px;
            color: $primary;
        }
    }

    h3 {
        font-size: $font-size-lg;
        margin-bottom: $spacing-sm;
    }

    p {
        color: $dark-30;
        line-height: 1.5;
    }
}

.subscription-faq {
    h2 {
        font-size: $font-size-2xl;
        text-align: center;
        margin-bottom: $spacing-xl;
    }
}

.faq-list {
    max-width: 800px;
    margin: 0 auto;
}

.faq-item {
    border-bottom: 1px solid $light;

    &:last-child {
        border-bottom: none;
    }

    &.active {
        .faq-question {
            color: $primary;
        }
    }

    .faq-question {
        @include flex(row, space-between, center);
        padding: $spacing-lg 0;
        cursor: pointer;
        font-weight: 500;

        .faq-icon {
            color: $dark-30;
        }
    }

    .faq-answer {
        padding: 0 0 $spacing-lg;
        color: $dark-20;
        line-height: 1.6;
    }
}
</style>