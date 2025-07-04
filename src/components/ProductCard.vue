<template>
  <router-link v-if="produto" :to="{ name: 'ProductDetail', params: { id: produto.id }}" class="product-card">
    <div class="product-image">
      <img :src="produto.imagens?.[0] || 'https://placehold.co/400x400/EFEFEF/333?text=Sem+Imagem'" :alt="produto.nome">
    </div>
    
    <div class="product-info">
      <h3 class="product-title">
        <router-link :to="{ name: 'ProductDetail', params: { id: produto.id }}">
          {{ produto.nome }}
        </router-link>
      </h3>
      
      <div class="product-price">
        <span class="price" v-if="getMinPrice() > 0">A partir de R$ {{ formatarPreco(getMinPrice()) }}</span>
        <span class="price" v-else>Consulte preço</span>
      </div>
    </div>
  </router-link>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useFavorites } from '../composables/useFavorites'
import { useCart } from '../composables/useCart'
import GhostSignupModal from './modals/GhostSignupModal.vue'

export default {
  name: 'ProductCard',
  
  components: {
    GhostSignupModal
  },

  props: {
    produto: {
      type: Object,
      required: true
    }
  },

  setup(props) {
    const { adicionarFavorito, removerFavorito, isFavorito } = useFavorites()
    const { adicionarAoCarrinho: addToCart } = useCart()
    const isLoading = ref(false)

    const toggleFavorito = async () => {
      if (isFavorito(props.produto.id)) {
        await removerFavorito(props.produto.id)
      } else {
        await adicionarFavorito(props.produto)
      }
    }

    const adicionarAoCarrinho = async () => {
      await addToCart(props.produto)
    }

    const formatarPreco = (preco) => {
      return preco.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    }

    const getMinPrice = () => {
      if (props.produto.variacoes && props.produto.variacoes.length > 0) {
        const precos = props.produto.variacoes
          .filter(v => v.ativo)
          .map(v => parseFloat(v.preco || 0))
          .filter(p => p > 0)
        return precos.length > 0 ? Math.min(...precos) : 0
      }
      return 0
    }

    return {
      isLoading,
      isFavorito: () => isFavorito(props.produto.id),
      toggleFavorito,
      adicionarAoCarrinho,
      formatarPreco,
      getMinPrice
    }
  }
}
</script>

<style lang="scss" scoped>
.product-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
}

.product-image {
  position: relative;
  padding-top: 100%;
  overflow: hidden;

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.product-info {
  padding: 1rem;
}

.product-title {
  margin: 0 0 0.5rem;
  font-size: 1rem;
  
  a {
    color: var(--color-text);
    text-decoration: none;
    
    &:hover {
      color: var(--color-primary);
    }
  }
}

.product-price {
  margin-bottom: 1rem;
  
  .price {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-primary);
  }
}

.add-to-cart-button {
  width: 100%;
  padding: 0.75rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: var(--color-primary-dark);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
}
</style>
