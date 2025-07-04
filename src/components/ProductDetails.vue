<template>
  <div v-if="isLoading" class="loading-state">
    <font-awesome-icon icon="spinner" spin size="3x" />
    <p>Carregando detalhes do produto...</p>
  </div>

  <div v-else-if="error" class="error-state">
    <font-awesome-icon icon="exclamation-triangle" size="3x" />
    <p>{{ error }}</p>
    <button @click="fetchProductDetails">Tentar Novamente</button>
  </div>

  <div v-else-if="product" class="product-details">
    <div class="product-gallery">
      <ProductGallery :images="product.images" />
    </div>

    <div class="product-info">
      <h1 class="product-title">{{ product.title }}</h1>
      
      <div class="product-badges" v-if="product.isNew || product.isBestseller || product.discount">
        <span class="badge badge-primary" v-if="product.isNew">Novo</span>
        <span class="badge badge-secondary" v-if="product.isBestseller">Mais Vendido</span>
        <span class="badge badge-tertiary" v-if="product.discount">-{{ product.discount }}%</span>
      </div>
      
      <div class="product-meta">
        <div class="product-category">
          Categoria: <span>{{ getCategoryLabel(product.category) }}</span>
        </div>
        <div class="product-age" v-if="product.ageRange">
          Faixa Etária: <span>{{ product.ageRange }}</span>
        </div>
        <div class="product-author" v-if="product.author">
          Autor: <span>{{ product.author }}</span>
        </div>
        <div class="product-illustrator" v-if="product.illustrator">
          Ilustrador: <span>{{ product.illustrator }}</span>
        </div>
      </div>
      
      <div class="product-rating" v-if="product.rating">
        <div class="stars">
          <font-awesome-icon 
            v-for="i in 5" 
            :key="i" 
            :icon="getStarIcon(i)" 
            :class="{ 'star-filled': i <= Math.floor(product.rating) }"
          />
        </div>
        <span class="rating-value">{{ product.rating.toFixed(1) }}</span>
        <span class="rating-count" v-if="product.reviewCount">({{ product.reviewCount }} avaliações)</span>
      </div>
      
      <div class="product-price">
        <div class="price-wrapper">
          <template v-if="product.price !== null">
            <span class="price-current">R$ {{ formatPrice(product.price) }}</span>
          </template>
          <template v-else>
            <span class="price-current">R$ {{ formatPrice(minPrice) }}</span>
            <span v-if="maxPrice > minPrice" class="price-range-sep"> - </span>
            <span v-if="maxPrice > minPrice" class="price-current">R$ {{ formatPrice(maxPrice) }}</span>
          </template>
        </div>
        <div class="price-installment" v-if="(product.price ?? minPrice) >= 50">
          ou 3x de R$ {{ formatPrice((product.price ?? minPrice) / 3) }} sem juros
        </div>
      </div>
      
      <div class="product-description">
        <h3 class="section-subtitle">Descrição</h3>
        <div class="description-content" v-html="product.description"></div>
      </div>
    </div>

    <div class="product-actions">
      <div class="quantity-selector">
        <button 
          @click="decreaseQuantity" 
          :disabled="quantity <= 1"
        >-</button>
        <span>{{ quantity }}</span>
        <button 
          @click="increaseQuantity"
          :disabled="quantity >= product.estoque"
        >+</button>
      </div>

      <button 
        class="add-to-cart-button"
        @click="addToCart"
        :disabled="isLoading"
      >
        <font-awesome-icon icon="shopping-cart" />
        Adicionar ao carrinho
      </button>

      <button 
        class="favorite-button"
        :class="{ 'is-favorite': isFavorite }"
        @click="toggleFavorite"
      >
        <font-awesome-icon :icon="['far', isFavorite ? 'heart' : 'heart']" />
        {{ isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos' }}
      </button>
    </div>

    <div class="product-shipping">
      <div class="shipping-info">
        <font-awesome-icon icon="truck" />
        <span>Frete grátis para compras acima de R$ 150,00</span>
      </div>
      <div class="shipping-calculator">
        <input 
          type="text" 
          v-model="cep" 
          placeholder="Digite seu CEP" 
          class="form-control cep-input"
          maxlength="9"
          @input="formatCEP"
        >
        <button class="btn btn-secondary calculate-btn" @click="calculateShipping">
          Calcular
        </button>
      </div>
    </div>

    <div class="product-details-tabs">
      <div class="tabs-header">
        <button 
          v-for="tab in tabs" 
          :key="tab.id" 
          class="tab-btn" 
          :class="{ active: activeTab === tab.id }"
          @click="setActiveTab(tab.id)"
        >
          {{ tab.label }}
        </button>
      </div>
      
      <div class="tab-content">
        <div v-if="activeTab === 'specifications'" class="specifications-tab">
          <table class="specifications-table">
            <tbody>
              <tr v-for="(value, key) in product.specifications" :key="key">
                <th>{{ formatSpecKey(key) }}</th>
                <td>{{ value }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div v-if="activeTab === 'reviews'" class="reviews-tab">
          <div v-if="product.reviews && product.reviews.length" class="reviews-list">
            <div v-for="(review, index) in product.reviews" :key="index" class="review-item">
              <div class="review-header">
                <div class="review-author">{{ review.author }}</div>
                <div class="review-date">{{ formatDate(review.date) }}</div>
              </div>
              <div class="review-rating">
                <div class="stars">
                  <font-awesome-icon 
                    v-for="i in 5" 
                    :key="i" 
                    icon="star" 
                    :class="{ 'star-filled': i <= review.rating }"
                  />
                </div>
              </div>
              <div class="review-content">{{ review.content }}</div>
            </div>
          </div>
          <div v-else class="no-reviews">
            Este produto ainda não possui avaliações.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import produtoService from '@/services/produtoService';
import { useCart } from '@/composables/useCart';
import favoritoService from '@/services/favoritoService';
import ProductGallery from './ProductGallery.vue';

export default {
  name: 'ProductDetails',
  components: {
    ProductGallery
  },
  setup() {
    const route = useRoute();
    const product = ref(null);
    const selectedVariation = ref(null);
    const isLoading = ref(true);
    const error = ref(null);

    const quantity = ref(1);
    const isFavorite = ref(false);
    const cep = ref('');
    const activeTab = ref('specifications');
    const tabs = [
        { id: 'specifications', label: 'Especificações' },
        { id: 'reviews', label: 'Avaliações' }
    ];
    
    const fetchProductDetails = async () => {
      isLoading.value = true;
      error.value = null;
      try {
        const productId = route.params.id;
        const data = await produtoService.getProdutoById(productId);
        
        // Mapeando a resposta da API para a estrutura que o template espera
        product.value = {
            id: data.id,
            title: data.nome,
            description: data.descricao,
            price: null, // Preço dependerá da variação
            image: data.imagens && data.imagens.length > 0 ? data.imagens[0] : 'https://via.placeholder.com/600',
            images: data.imagens || [],
            category: data.categoria?.toString(),
            // Campos que podem não existir na API - adicionar v-if no template ou valores padrão
            author: data.autor, // Supondo que a API pode retornar 'autor'
            ageRange: data.faixaEtaria, // Supondo que a API pode retornar 'faixaEtaria'
            specifications: data.especificacoes || {}, // Supondo 'especificacoes'
            reviews: data.Avaliacaos || [], // Usando 'Avaliacaos'
            rating: data.Avaliacaos && data.Avaliacaos.length > 0
              ? data.Avaliacaos.reduce((acc, r) => acc + r.nota, 0) / data.Avaliacaos.length
              : null,
            reviewCount: data.Avaliacaos ? data.Avaliacaos.length : 0,
            variacoes: data.variacoes || [],
        };

        // Verificar se já é favorito
        try {
          const favResp = await favoritoService.verificarFavorito(product.value.id);
          isFavorite.value = favResp.data.isFavorito;
        } catch (e) {
          isFavorite.value = false;
        }

        // Não seleciona variação por padrão; exibe faixa de preços
      } catch (err) {
        console.error("Erro ao buscar detalhes do produto:", err);
        error.value = "Não foi possível encontrar o produto. Tente novamente mais tarde.";
      } finally {
        isLoading.value = false;
      }
    };
    
    onMounted(fetchProductDetails);
    
    // Métodos que antes estavam em 'methods'
    const formatPrice = (price) => {
      const numeric = parseFloat(price);
      if (isNaN(numeric)) return '0,00';
      return numeric.toFixed(2).replace('.', ',');
    };

    const increaseQuantity = () => quantity.value++;
    const decreaseQuantity = () => {
      if (quantity.value > 1) quantity.value--;
    };
    
    const { addToCart: addToCartGlobal } = useCart();

    const addToCart = () => {
      if (!selectedVariation.value) {
        alert('Selecione uma variação do produto.');
        return;
      }
      addToCartGlobal(product.value.id, selectedVariation.value.id, quantity.value)
        .then(() => {
          alert('Produto adicionado ao carrinho!');
        })
        .catch((err) => {
          console.error(err);
          alert('Não foi possível adicionar ao carrinho.');
        });
    };

    const toggleFavorite = async () => {
      try {
        if (isFavorite.value) {
          await favoritoService.removerFavorito(product.value.id);
          isFavorite.value = false;
        } else {
          await favoritoService.addFavorito({ produtoId: product.value.id });
          isFavorite.value = true;
        }
      } catch (err) {
        console.error('Erro ao atualizar favorito:', err);
      }
    };
    
    const getCategoryLabel = (category) => {
      const categories = { '1': 'Infantil', '2': 'Juvenil', '3': 'Adulto' }; // Exemplo
      return categories[category] || category;
    };
    
    // Outros métodos como formatCEP, calculateShipping, etc. podem ser movidos para cá também.
    const formatCEP = () => {
      // Formatar CEP como 00000-000
      cep.value = cep.value.replace(/\D/g, '')
      if (cep.value.length > 5) {
        cep.value = cep.value.substring(0, 5) + '-' + cep.value.substring(5, 8)
      }
    };

    const calculateShipping = () => {
      if (cep.value.length === 9) {
        alert(`Frete calculado para o CEP ${cep.value}: R$ 15,90`)
      } else {
        alert('Por favor, digite um CEP válido')
      }
    };
    
    const setActiveTab = (tabId) => activeTab.value = tabId;

    const formatSpecKey = (key) => {
      return key
        .replace(/_/g, ' ')
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
    };

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    };

    const getStarIcon = (position) => {
      const rating = product.value.rating
      
      if (position <= Math.floor(rating)) {
        return 'star'
      } else if (position === Math.ceil(rating) && !Number.isInteger(rating)) {
        return 'star-half-alt'
      } else {
        return 'star'
      }
    };

    // Faixa de preços
    const minPrice = computed(() => {
      if (!product.value?.variacoes?.length) return 0;
      return Math.min(...product.value.variacoes.map(v => parseFloat(v.preco)));
    });

    const maxPrice = computed(() => {
      if (!product.value?.variacoes?.length) return 0;
      return Math.max(...product.value.variacoes.map(v => parseFloat(v.preco)));
    });

    return {
      product,
      selectedVariation,
      isLoading,
      error,
      quantity,
      isFavorite,
      cep,
      activeTab,
      tabs,
      fetchProductDetails,
      formatPrice,
      increaseQuantity,
      decreaseQuantity,
      addToCart,
      toggleFavorite,
      getCategoryLabel,
      formatCEP,
      calculateShipping,
      setActiveTab,
      formatSpecKey,
      formatDate,
      getStarIcon,
      minPrice,
      maxPrice
    };
  }
}
</script>

<style lang="scss">
@use 'sass:color';

.loading-state, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $spacing-2xl;
  text-align: center;
  min-height: 400px;
}

.product-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  padding: 2rem;
}

.product-gallery {
  border-radius: 8px;
  overflow: hidden;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.product-badges {
  margin-bottom: $spacing-md;
  
  .badge {
    margin-right: $spacing-xs;
  }
}

.product-title {
  font-size: $font-size-3xl;
  margin-bottom: $spacing-md;
  color: #2d3748;;
  font-weight: 700;
}

.product-meta {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: $spacing-sm;
  margin-bottom: $spacing-md;
  font-size: $font-size-sm;
  
  > div {
    color: color.adjust(#2d3748, $lightness: 30%);
    
    span {
      color: #2d3748;;
      font-weight: 500;
    }
  }
}

.product-rating {
  @include flex(row, flex-start, center);
  margin-bottom: $spacing-lg;
  
  .stars {
    color: color.adjust(#2d3748, $lightness: 30%);
    font-size: $font-size-md;
    
    .star-filled {
      color: #FFD700; // Cor dourada para estrelas
    }
  }
  
  .rating-value {
    font-weight: 600;
    margin: 0 $spacing-xs;
  }
  
  .rating-count {
    font-size: $font-size-sm;
    color: color.adjust(#2d3748, $lightness: 30%);
  }
}

.product-price {
  margin-bottom: $spacing-lg;
  
  .price-wrapper {
    @include flex(row, flex-start, baseline);
    margin-bottom: $spacing-xs;
  }
  
  .price-current {
    font-size: $font-size-3xl;
    font-weight: 700;
    color: color.adjust(#2d3748, $lightness: 50%);
  }
  
  .price-old {
    font-size: $font-size-lg;
    color: color.adjust(#2d3748, $lightness: 30%);
    text-decoration: line-through;
    margin-left: $spacing-md;
  }
  
  .price-installment {
    font-size: $font-size-sm;
    color: color.adjust(#2d3748, $lightness: 20%);
  }
}

.product-description {
  margin-bottom: $spacing-xl;
  
  .section-subtitle {
    font-size: $font-size-xl;
    margin-bottom: $spacing-md;
    color: #2d3748;;
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
  
  .description-content {
    line-height: 1.8;
    color: color.adjust(#2d3748, $lightness: 20%);
    
    p {
      margin-bottom: $spacing-md;
    }
    
    ul, ol {
      margin-bottom: $spacing-md;
      padding-left: $spacing-lg;
      
      li {
        margin-bottom: $spacing-xs;
      }
    }
    
    ul {
      list-style-type: disc;
    }
    
    ol {
      list-style-type: decimal;
    }
  }
}

.product-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 1rem;
  
  button {
    width: 36px;
    height: 36px;
    border: 1px solid var(--color-border);
    background: white;
    border-radius: 4px;
    cursor: pointer;
    
    &:hover:not(:disabled) {
      background: var(--color-background-light);
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
  
  span {
    font-size: 1.25rem;
    font-weight: 500;
    min-width: 40px;
    text-align: center;
  }
}

.add-to-cart-button {
  padding: 1rem;
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

.favorite-button {
  padding: 1rem;
  background: white;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s;

  &:hover {
    background: var(--color-background-light);
  }

  &.is-favorite {
    color: var(--color-primary);
    border-color: var(--color-primary);
  }
}

.product-shipping {
  background-color: $light;
  border-radius: $border-radius-lg;
  padding: $spacing-md;
  margin-bottom: $spacing-xl;
}

.shipping-info {
  @include flex(row, flex-start, center);
  margin-bottom: $spacing-md;
  
  svg {
    color: $primary;
    margin-right: $spacing-sm;
    font-size: $font-size-lg;
  }
}

.shipping-calculator {
  @include flex(row, flex-start, center);
  
  .cep-input {
    max-width: 150px;
    margin-right: $spacing-sm;
  }
}

.product-details-tabs {
  margin-bottom: $spacing-xl;
}

.tabs-header {
  @include flex(row, flex-start, center);
  border-bottom: 1px solid color.adjust(#2d3748, $lightness: 60%);
  margin-bottom: $spacing-lg;
}

.tab-btn {
  padding: $spacing-sm $spacing-lg;
  font-weight: 600;
  color: color.adjust(#2d3748, $lightness: 20%);
  position: relative;
  
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
}

.specifications-table {
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: $spacing-sm;
    text-align: left;
    border-bottom: 1px solid color.adjust(#2d3748, $lightness: 70%);
  }
  
  th {
    width: 40%;
    font-weight: 600;
    color: #2d3748;;
  }
  
  td {
    color: color.adjust(#2d3748, $lightness: 20%);
  }
  
  tr:last-child {
    th, td {
      border-bottom: none;
    }
  }
}

.reviews-list {
  .review-item {
    padding: $spacing-md 0;
    border-bottom: 1px solid color.adjust(#2d3748, $lightness: 70%);
    
    &:last-child {
      border-bottom: none;
    }
  }
}

.review-header {
  @include flex(row, space-between, center);
  margin-bottom: $spacing-xs;
}

.review-author {
  font-weight: 600;
  color: color.adjust(#2d3748, $lightness: 20%);
}

.review-date {
  font-size: $font-size-xs;
  color: color.adjust(#2d3748, $lightness: 30%);
}

.review-rating {
  margin-bottom: $spacing-xs;
  
  .stars {
    color: color.adjust(#2d3748, $lightness: 30%);
    font-size: $font-size-sm;
    
    .star-filled {
      color: #FFD700; // Cor dourada para estrelas
    }
  }
}

.review-content {
  font-size: $font-size-sm;
  line-height: 1.6;
  color: color.adjust(#2d3748, $lightness: 20%);
}

.no-reviews {
  padding: $spacing-md;
  text-align: center;
  color: color.adjust(#2d3748, $lightness: 20%);
  font-style: italic;
}
</style>

