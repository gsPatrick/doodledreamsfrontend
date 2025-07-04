<!-- src/components/ProductGrid.vue -->
<template>
    <div class="product-grid">
        <router-link :to="`/produto/${product.id}`" v-for="product in products" :key="product.id" class="product-card">
            <div class="product-image">
                <img :src="product.image" :alt="product.title">
                <div class="product-badges">
                    <span v-if="product.isBestseller" class="badge bestseller">Mais Vendido</span>
                    <span v-if="product.isNew" class="badge new">Novo</span>
                    <span v-if="product.discount" class="badge discount">-{{ product.discount }}%</span>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-title">{{ product.title }}</h3>
                <p class="product-author">{{ product.author }}</p>
                <div class="product-rating" v-if="product.rating">
                    <div class="stars">
                        <font-awesome-icon icon="star" v-for="n in Math.floor(product.rating)" :key="n" />
                        <font-awesome-icon icon="star-half" v-if="product.rating % 1 >= 0.5" />
                    </div>
                    <span class="review-count">({{ product.reviewCount }})</span>
                </div>
                <div class="product-price">
                    <span v-if="product.oldPrice" class="old-price">R$ {{ formatPrice(product.oldPrice) }}</span>
                    <span class="current-price">R$ {{ formatPrice(getMinPrice(product)) }}</span>
                </div>
                <button class="add-to-cart" @click.prevent="$emit('add-to-cart', product)">
                    <font-awesome-icon icon="shopping-cart" /> Adicionar ao Carrinho
                </button>
            </div>
        </router-link>
    </div>
</template>

<script>
export default {
    name: 'ProductGrid',
    props: {
        products: {
            type: Array,
            default: () => []
        }
    },
    emits: ['add-to-cart'],
    methods: {
        formatPrice(price) {
            return price.toFixed(2)
        },
        getMinPrice(product) {
            if (product.variacoes && product.variacoes.length > 0) {
                const precos = product.variacoes
                    .map(v => parseFloat(v.preco || 0))
                    .filter(p => p > 0)
                return precos.length > 0 ? Math.min(...precos) : 0
            }
            return product.price || 0
        }
    }
}
</script>

<style lang="scss" scoped>
@use "sass:color";
/* Variáveis e mixins globais já disponíveis */

.product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 2rem;
    padding: 2rem;
}

.product-card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease;
    overflow: hidden;

    &:hover {
        transform: translateY(-5px);
    }
}

.product-image {
    position: relative;
    aspect-ratio: 1;
    overflow: hidden;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}

.product-badges {
    position: absolute;
    top: 10px;
    left: 10px;
    display: flex;
    flex-direction: column;
    gap: 5px;

    .badge {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.8rem;
        font-weight: 600;

        &.bestseller {
            background: #ffd700;
            color: #000;
        }

        &.new {
            background: #4CAF50;
            color: white;
        }

        &.discount {
            background: #f44336;
            color: white;
        }
    }
}

.product-info {
    padding: 1rem;
}

.product-title {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
}

.product-author {
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
}

.product-rating {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;

    .stars {
        color: #ffd700;
    }

    .review-count {
        color: #666;
        font-size: 0.9rem;
    }
}

.product-price {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;

    .old-price {
        color: #666;
        text-decoration: line-through;
        font-size: 0.9rem;
    }

    .current-price {
        color: #000;
        font-weight: 600;
        font-size: 1.2rem;
    }
}

.add-to-cart {
    width: 100%;
    padding: 0.8rem;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;

    &:hover {
        background: color.adjust(#4CAF50, $lightness: -10%);
    }
}
</style>