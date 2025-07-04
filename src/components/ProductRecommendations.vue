<template>
  <section class="product-recommendations" v-if="produtos && produtos.length > 0">
    <h2 class="section-title">{{ title }}</h2>
    <p class="section-subtitle" v-if="subtitle">{{ subtitle }}</p>
    
    <div class="recommendations-grid">
      <div 
        v-for="produto in produtos" 
        :key="produto.id"
        class="recommendation-item"
      >
        <ProductCard :produto="produto" @add-to-cart="addToCart" />
      </div>
    </div>
  </section>
</template>

<script>
import ProductCard from './ProductCard.vue'
import { useCart } from '../composables/useCart'
import { useNotifications } from '../composables/useNotifications'
import { useFavorites } from '../composables/useFavorites'

export default {
  name: 'ProductRecommendations',
  components: {
    ProductCard
  },
  props: {
    title: {
      type: String,
      default: 'Você também pode gostar'
    },
    subtitle: {
      type: String,
      default: ''
    },
    produtos: {
      type: Array,
      required: true
    },
    currentProductId: {
      type: [String, Number],
      default: null
    }
  },
  setup(props) {
    const { addToCart } = useCart()
    const { addNotification } = useNotifications()
    const { adicionarFavorito, removerFavorito } = useFavorites()

    return {
      addToCart
    }
  }
}
</script>

<style lang="scss" scoped>
.product-recommendations {
  padding: 2rem 0;
  margin-top: 2rem;
  border-top: 1px solid #e2e8f0;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
  text-align: center;
}

.section-subtitle {
  font-size: 1rem;
  color: #718096;
  margin-bottom: 2rem;
  text-align: center;
}

.recommendations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  padding: 0 1rem;
}

.recommendation-item {
  width: 100%;
}

@media (max-width: 640px) {
  .recommendations-grid {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 641px) and (max-width: 1024px) {
  .recommendations-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}
</style>

