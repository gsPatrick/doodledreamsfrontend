<template>
  <div class="product-detail">
    <ToastNotification />
    
    <!-- Modal de Cadastro Rápido (seu código original mantido) -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h2>Cadastro Rápido</h2>
          <button class="close-button" @click="fecharModal">
            <font-awesome-icon icon="times" />
          </button>
        </div>
        <div class="modal-body">
          <p style="color: gray !important;">Para continuar, informe seus dados abaixo:</p>
          <div class="form-group">
            <label for="nome">Nome</label>
            <input type="text" id="nome" v-model="formData.nome" placeholder="Seu nome" class="form-control" required />
          </div>
          <div class="form-group">
            <label for="email">E-mail</label>
            <input type="email" id="email" v-model="formData.email" placeholder="seu@email.com" class="form-control" required /> 
          </div>
          <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>
          <div class="modal-actions">
            <button class="submit-button" @click="criarConta" :disabled="isLoadingModal">
              <span v-if="isLoadingModal">Processando...</span>
              <span v-else>Continuar</span>
            </button>
            <div class="login-link">
              Já tem uma conta? 
              <router-link to="/login" @click="fecharModal">Faça login</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <!-- Breadcrumb -->
      <div v-if="product" class="breadcrumb">
        <router-link to="/" class="breadcrumb-item">Home</router-link>
        <span class="breadcrumb-separator">/</span>
        <router-link to="/catalog" class="breadcrumb-item">Catálogo</router-link>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-item active"> {{ product.title }}</span>
      </div>

      <div v-if="loading" class="loading-product">
        <div class="loading-spinner"><font-awesome-icon icon="spinner" spin /></div>
        <p>Carregando produto...</p>
      </div>

      <div v-else-if="error" class="product-not-found">
        <div class="not-found-icon"><font-awesome-icon icon="exclamation-circle" /></div>
        <h2>Produto não encontrado</h2>
        <p>{{ error }}</p>
        <router-link to="/catalog" class="btn btn-primary"> Voltar para o Catálogo </router-link>
      </div>

      <div v-else-if="product" class="product-content">
        <div class="product-gallery">
          <div class="main-image">
            <transition name="fade-image" mode="out-in">
              <video v-if="activeMedia && activeMedia.tipo === 'video'" :key="activeMedia.url" controls class="product-video">
                <source :src="activeMedia.url" :type="activeMedia.mimeType || 'video/mp4'">
                Seu navegador não suporta o elemento de vídeo.
              </video>
              <img v-else :key="activeImageUrl" :src="activeImageUrl" :alt="product.title" />
            </transition>
          </div>
          <div class="thumbnail-list">
            <button v-for="(image, index) in product.imagens" :key="`img-${index}`" class="thumbnail" :class="{ active: selectedImage === index && !selectedVideo }" @click="selectImage(index)">
              <img :src="image" :alt="`${product.title} - Imagem ${index + 1}`" />
            </button>
            <button v-for="(video, index) in videos" :key="`video-${video.id}`" class="thumbnail video-thumbnail" :class="{ active: selectedVideo === video.id }" @click="selectVideo(video)">
              <div class="video-icon"><font-awesome-icon icon="play-circle" /></div>
              <img src="https://placehold.co/80x80/EFEFEF/333?text=Vídeo" :alt="`${product.title} - Vídeo ${index + 1}`" />
            </button>
          </div>
        </div>

        <div class="product-info">
          <h1 class="product-title">{{ product.title }}</h1>
          <div class="product-meta">
            <div class="author" v-if="product.author">por <span>{{ product.author }}</span></div>
            <div class="publisher" v-if="product.publisher">Editora: <span>{{ product.publisher }}</span></div>
            <div class="category" v-if="product.categoria">Categoria: <span>{{ product.categoria.nome }}</span></div>
          </div>
          <div class="product-price">
            <div v-if="product.discount" class="discount-badge">-{{ product.discount }}%</div>
            <div class="price-container">
              <span v-if="product.oldPrice" class="old-price">R$ {{ formatPrice(product.oldPrice) }}</span>
              <span class="current-price">
                <template v-if="selectedVariation">R$ {{ formatPrice(selectedVariation.preco) }}</template>
                <template v-else>
                  R$ {{ formatPrice(minPrice) }}<span v-if="maxPrice > minPrice"> - R$ {{ formatPrice(maxPrice) }}</span>
                </template>
              </span>
            </div>
          </div>

          <!-- Seleção de Variações -->
          <div class="product-variations" v-if="product.variacoes && product.variacoes.length">
            <label class="variations-label">Variações:</label>
            <div class="variations-options">
              <div v-for="variation in product.variacoes" :key="variation.id" class="variation-option" :class="{ 'active': selectedVariation && selectedVariation.id === variation.id }" @click="selectVariation(variation)">
                <div class="variation-radio"><div class="radio-inner" v-if="selectedVariation && selectedVariation.id === variation.id"></div></div>
                <div class="variation-details">
                  <div class="variation-name">{{ variation.nome }}</div>
                  <div class="variation-price">R$ {{ formatPrice(variation.preco) }}</div>
                  <div class="variation-stock" v-if="variation.estoque !== undefined">
                    <span v-if="variation.estoque > 0">{{ variation.estoque }} em estoque</span>
                    <span v-else class="out-of-stock">Fora de estoque</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="product-actions gap-4">
            <div class="quantity-selector">
              <button class="quantity-btn" @click="decreaseQuantity" :disabled="quantity === 1"><font-awesome-icon icon="minus" /></button>
              <input type="number" v-model="quantity" min="1" max="99" class="quantity-input" />
              <button class="quantity-btn" @click="increaseQuantity" :disabled="quantity === 99"><font-awesome-icon icon="plus" /></button>
            </div>

            <!-- BOTÃO CORRIGIDO -->
            <button class="btn btn-primary btn-lg btn-block" @click="handleAddToCart" :disabled="isAddingToCart || !selectedVariation">
              <font-awesome-icon v-if="!isAddingToCart" icon="shopping-bag" />
              <font-awesome-icon v-else icon="spinner" spin />
              {{ isAddingToCart ? 'Adicionando...' : 'Adicionar ao Carrinho' }}
            </button>

            <button class="btn btn-outline btn-lg btn-block favorite-btn" @click="toggleFavorite" :class="{ active: isFavorite }">
              <font-awesome-icon icon="heart" />
              {{ isFavorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos' }}
            </button>
          </div>

          <div class="product-description" v-if="product.description">
            <h2>Descrição</h2>
            <p>{{ product.description }}</p>
          </div>
        </div>
      </div>

      <ProductRecommendations v-if="product" title="Você também pode gostar" subtitle="Baseado nas suas preferências" :produtos="recommendedProducts" :current-product-id="product.id" />
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useCart } from '../composables/useCart'
import { useFavorites } from '../composables/useFavorites'
import { useNotifications } from '@/composables/useNotifications'
import produtoService from '@/services/produtoService'
import ProductRecommendations from '@/components/ProductRecommendations.vue'
import ToastNotification from '@/components/ToastNotification.vue'
import favoritoService from '@/services/favoritoService'
import authService from '@/services/authService'

export default {
  name: 'ProductDetail',
  components: {
    ProductRecommendations,
    ToastNotification,
  },
  setup() {
    const route = useRoute()
    const { adicionarAoCarrinho } = useCart() // <-- A função do composable já está aqui
    const { adicionarFavorito, removerFavorito } = useFavorites()
    const { addNotification } = useNotifications()

    // Estado do modal (sua lógica original mantida)
    const showModal = ref(false)
    const formData = ref({
      nome: '',
      email: ''
    })
    const isLoadingModal = ref(false)
    const errorMessage = ref('')
    const pendingAction = ref(null)

    const fecharModal = () => {
      showModal.value = false
      formData.value = { nome: '', email: '' }
      errorMessage.value = ''
      pendingAction.value = null
    }

    const openGhostSignup = (action) => {
      console.log('openGhostSignup chamado, abrindo modal...')
      pendingAction.value = action
      showModal.value = true
      console.log('Estado do showModal:', showModal.value)
    }

    const criarConta = async () => {
      if (!formData.value.nome || !formData.value.email) {
        errorMessage.value = 'Por favor, preencha todos os campos'
        return
      }
      
      try {
        isLoadingModal.value = true
        errorMessage.value = ''
        
        const resultado = await authService.criarContaGhost(
          formData.value.nome,
          formData.value.email
        )
        
        if (resultado.token) {
          localStorage.setItem('token', resultado.token)
        }
        
        fecharModal()
        addNotification({
          message: 'Conta criada com sucesso!',
          type: 'success'
        })

        // Executa a ação pendente após o cadastro
        if (pendingAction.value && typeof pendingAction.value === 'function') {
          await pendingAction.value();
        }
        
      } catch (error) {
        console.error('Erro ao criar conta:', error)
        errorMessage.value = error.response?.data?.erro || 'Erro ao criar conta. Tente novamente.'
      } finally {
        isLoadingModal.value = false
      }
    }

    const loading = ref(true)
    const product = ref(null)
    const error = ref(null)
    const selectedImage = ref(0)
    const selectedVariation = ref(null)
    const quantity = ref(1)
    const isFavorite = ref(false)
    const recommendedProducts = ref([])
    const isAddingToCart = ref(false)
    const selectedVideo = ref(null)
    const videos = ref([])
    const activeMedia = ref(null)

    const mapProductData = p => {
      // ... sua função mapProductData original mantida ...
      if (!p) return null

      const getImageUrl = url => {
        if (!url) return 'https://placehold.co/400x400/EFEFEF/333?text=Sem+Imagem'
        return url
      }

      let images = []
      let productVideos = []

      if (p.imagens && p.imagens.length > 0) {
        images = p.imagens.map(getImageUrl)
      } 
      
      if (p.ArquivoProdutos && p.ArquivoProdutos.length > 0) {
        const imageFiles = p.ArquivoProdutos.filter(f => f.tipo === 'imagem')
        if (imageFiles.length > 0) {
          images = imageFiles.map(img => getImageUrl(img.url))
        }
        
        productVideos = p.ArquivoProdutos.filter(f => f.tipo === 'video')
      }
      
      if (images.length === 0) {
        images = [getImageUrl(null)]
      }

      videos.value = productVideos

      return {
        id: p.id,
        nome: p.nome,
        title: p.nome,
        description: p.descricao,
        price: null,
        variacoes: p.variacoes || [],
        imagens: images,
        videos: productVideos,
        image: images[0],
        category: p.categoria?.id,
        categoria: p.categoria,
        author: p.autor,
        publisher: p.editora,
        pages: p.paginas,
        isbn: p.isbn,
        language: p.idioma,
        dimensions: p.dimensoes,
        publishYear: p.anoPublicacao,
        rating: p.Avaliacaos?.length
          ? (p.Avaliacaos.reduce((acc, r) => acc + r.nota, 0) / p.Avaliacaos.length).toFixed(1)
          : 0,
        reviewCount: p.Avaliacaos?.length || 0,
      }
    }

    const fetchProductData = async () => {
      loading.value = true
      error.value = null
      try {
        const productId = route.params.id
        const data = await produtoService.getProdutoById(productId)
        product.value = mapProductData(data)
        
        if (product.value?.variacoes?.length > 0) {
          selectVariation(product.value.variacoes[0])
        }

        try {
          const favResp = await favoritoService.verificarFavorito(productId);
          isFavorite.value = favResp.data.isFavorito;
        } catch (err) {
          console.error("Erro ao verificar favorito:", err);
          isFavorite.value = false;
        }

        if (product.value?.category) {
          const recData = await produtoService.getProdutos({
            categoria: product.value.categoria.id,
            limit: 5,
          })
          
          recommendedProducts.value = recData.produtos
            .filter(p => p.id !== product.value.id)
            .map(mapProductData);
        }
      } catch (err) {
        console.error('Erro ao carregar produto:', err)
        error.value = 'O produto que você está procurando não foi encontrado.'
      } finally {
        loading.value = false
      }
    }

    onMounted(fetchProductData)
    watch(() => route.params.id, fetchProductData)

    const selectImage = (index) => {
      selectedImage.value = index
      selectedVideo.value = null
      activeMedia.value = null
    }

    const selectVideo = (video) => {
      selectedVideo.value = video.id
      activeMedia.value = video
    }

    const selectVariation = (variation) => {
      selectedVariation.value = variation
      if (product.value) { // <-- ADIÇÃO: Verificação de segurança
        product.value.price = parseFloat(variation.preco)
      }
    }

    const activeImageUrl = computed(() => {
      if (product.value?.imagens?.[selectedImage.value]) {
        return product.value.imagens[selectedImage.value]
      }
      return 'https://placehold.co/400x400/EFEFEF/333?text=Sem+Imagem'
    })

    const formatPrice = value => {
      const num = parseFloat(value)
      if (isNaN(num)) return '0,00'
      return num.toFixed(2).replace('.', ',')
    }
    
    const decreaseQuantity = () => {
      if (quantity.value > 1) quantity.value--
    }
    
    const increaseQuantity = () => {
      if (quantity.value < 99) quantity.value++
    }
    
    // <-- CORREÇÃO: Nome da função mudado para evitar conflito com a importada
    const handleAddToCart = async () => {
      if (!selectedVariation.value) {
        addNotification({
          message: 'Por favor, selecione uma variação do produto',
          type: 'warning',
        })
        return
      }

      // Função interna para a lógica de adicionar ao carrinho
      const doAddToCart = async () => {
        isAddingToCart.value = true;
        try {
          // <-- CORREÇÃO: Passando o objeto do produto, a quantidade e o ID da variação
          await adicionarAoCarrinho(
            product.value,
            quantity.value,
            selectedVariation.value.id 
          );
        } catch (error) {
          console.error('Erro ao adicionar ao carrinho:', error);
          addNotification({
            message: error.response?.data?.mensagem || 'Não foi possível adicionar o produto.',
            type: 'error',
          });
        } finally {
          isAddingToCart.value = false;
        }
      };

      const token = localStorage.getItem('token');
      if (!token) {
        console.log('Usuário não logado, abrindo modal de cadastro...');
        // Passa a função 'doAddToCart' como callback para ser executada após o login/cadastro
        openGhostSignup(doAddToCart);
        return;
      }
      
      // Se já estiver logado, executa a ação diretamente
      await doAddToCart();
    }
    
    const toggleFavorite = async () => {
      // ... sua lógica original de favoritos mantida ...
      const token = localStorage.getItem('token')
      if (!token) {
        console.log('Usuário não logado, abrindo modal de cadastro...')
        openGhostSignup(() => {
          console.log('Callback do modal executado, adicionando aos favoritos...')
          adicionarFavorito({
            id: product.value.id
          })
          isFavorite.value = true
        })
        return
      }

      try {
        if (isFavorite.value) {
          await removerFavorito(product.value.id)
          isFavorite.value = false
        } else {
          await adicionarFavorito({
            id: product.value.id
          })
          isFavorite.value = true
        }
      } catch (error) {
        console.error('Erro ao atualizar favorito:', error)
      }
    }

    const minPrice = computed(() => {
      return product.value?.variacoes?.length
        ? Math.min(...product.value.variacoes.map(v => parseFloat(v.preco)))
        : 0
    })

    const maxPrice = computed(() => {
      return product.value?.variacoes?.length
        ? Math.max(...product.value.variacoes.map(v => parseFloat(v.preco)))
        : 0
    })

    return {
      loading,
      product,
      error,
      selectedImage,
      selectedVariation,
      quantity,
      isFavorite,
      activeImageUrl,
      recommendedProducts,
      formatPrice,
      decreaseQuantity,
      increaseQuantity,
      handleAddToCart, // <-- CORREÇÃO: Exportando a função com o novo nome
      toggleFavorite,
      isAddingToCart,
      minPrice,
      maxPrice,
      videos,
      selectedVideo,
      selectImage,
      selectVideo,
      activeMedia,
      selectVariation,
      showModal,
      formData,
      isLoadingModal,
      errorMessage,
      fecharModal,
      criarConta
    }
  },
}
</script>

<style lang="scss">
@use 'sass:color';

.product-detail {
  padding: $spacing-xl 0;
}

.fade-image-enter-active,
.fade-image-leave-active {
  transition: opacity 0.3s ease;
}
.fade-image-enter-from,
.fade-image-leave-to {
  opacity: 0;
}

.breadcrumb {
  margin-bottom: $spacing-lg;
  font-size: $font-size-sm;

  .breadcrumb-item {
    color: $dark-30;

    &.active {
      color: $dark;
      font-weight: 500;
    }
  }

  .breadcrumb-separator {
    margin: 0 $spacing-xs;
    color: $dark-50;
  }
}

.loading-product,
.product-not-found {
  text-align: center;
  padding: $spacing-2xl 0;
}

.loading-spinner {
  font-size: $font-size-3xl;
  color: $primary;
  margin-bottom: $spacing-md;
}

.not-found-icon {
  font-size: $font-size-3xl;
  color: $dark-50;
  margin-bottom: $spacing-md;
}

.product-content {
  margin-top: $spacing-xl;
  display: grid;
  grid-template-columns: 1fr;
  gap: $spacing-xl;

  @include respond-to('lg') {
    grid-template-columns: 1fr 1fr;
  }
}

.product-gallery {
  display: flex;
  flex-direction: column;
  align-items: center;

  @include respond-to('md') {
    width: 100%;
  }

  .main-image {
    width: 100%;
    max-width: 700px;
    aspect-ratio: 1;
    border-radius: $border-radius-lg;
    overflow: hidden;
    position: relative;

    img, video {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }

    .product-video {
      width: 100%;
      height: 100%;
      object-fit: contain;
      background-color: #000;
    }

    &:hover img {
      transform: scale(1.05);
    }
  }

  .thumbnail-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 12px;
    margin-top: 8px;
    width: 100%;

    @include respond-to('md') {
      overflow-x: auto;
      flex-wrap: nowrap;
    }
  }

  .thumbnail {
    aspect-ratio: 1;
    border-radius: $border-radius-md;
    overflow: hidden;
    border: 2px solid transparent;
    cursor: pointer;
    padding: 0;
    flex-shrink: 0;
    width: 80px;
    position: relative;

    &.active {
      border-color: $primary;
      box-shadow: 0 0 8px rgba($primary, 0.4);
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    &.video-thumbnail {
      .video-icon {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(0, 0, 0, 0.3);
        color: white;
        font-size: 24px;
      }
    }
  }
}

.product-info {
  .product-title {
    font-size: $font-size-2xl;
    margin-bottom: $spacing-md;
  }

  .product-meta {
    margin-bottom: $spacing-md;

    a {
      color: $primary;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}

.product-price {
  background-color: $primary-light-20;
  padding: $spacing-lg;
  border-radius: $border-radius-lg;
  margin-bottom: $spacing-lg;

  .discount-badge {
    display: inline-block;
    padding: $spacing-xs $spacing-sm;
    background-color: $danger;
    color: #ffffff;
    border-radius: $border-radius-sm;
    font-weight: 500;
    margin-bottom: $spacing-xs;
  }

  .price-container {
    @include flex(row, flex-start, center);
    gap: $spacing-sm;
    margin-bottom: $spacing-xs;
  }

  .old-price {
    color: $dark-30;
    text-decoration: line-through;
  }

  .current-price {
    font-size: $font-size-2xl;
    font-weight: 600;
    color: $primary;
  }

  .installments {
    font-size: $font-size-sm;
    color: $dark-30;
  }
}

.product-variations {
  margin-bottom: $spacing-lg;
  
  .variations-label {
    display: block;
    font-weight: 600;
    margin-bottom: $spacing-sm;
  }
  
  .variations-options {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
  }
  
  .variation-option {
    display: flex;
    align-items: center;
    padding: $spacing-md;
    border: 1px solid $light;
    border-radius: $border-radius-md;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      border-color: $primary-light-1;
      background-color: $primary-light-20;
    }
    
    &.active {
      border-color: $primary;
      background-color: color.adjust($light, $lightness: -5%);
    }
    
    .variation-radio {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 2px solid $dark-30;
      margin-right: $spacing-md;
      display: flex;
      align-items: center;
      justify-content: center;
      
      .radio-inner {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: $primary;
      }
    }
    
    &.active .variation-radio {
      border-color: $primary;
    }
    
    .variation-details {
      flex: 1;
    }
    
    .variation-name {
      font-weight: 600;
      margin-bottom: $spacing-xs;
    }
    
    .variation-price {
      color: $primary;
      font-weight: 600;
    }
    
    .variation-stock {
      font-size: $font-size-sm;
      color: $dark-30;
      margin-top: $spacing-xs;
      
      .out-of-stock {
        color: $danger;
        background-color: color.adjust($danger, $lightness: 35%);
      }
    }
  }
}

.product-actions {
  margin-bottom: $spacing-xl;

  .quantity-selector {
    @include flex(row, flex-start, center);
    gap: $spacing-xs;
    margin-bottom: $spacing-md;

    .quantity-btn {
      width: 36px;
      height: 36px;
      @include flex(row, center, center);
      background-color: $light;
      border: none;
      border-radius: $border-radius-sm;
      color: $dark;
      cursor: pointer;

      &:hover:not(:disabled) {
        background-color: color.adjust($light, $lightness: -5%);
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    .quantity-input {
      width: 60px;
      height: 36px;
      text-align: center;
      border: 1px solid $light;
      border-radius: $border-radius-sm;

      &::-webkit-inner-spin-button,
      &::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
    }
  }

  .btn {
    margin-bottom: $spacing-sm;
    width: 100%;
    height: 48px;
    font-size: $font-size-md;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $spacing-sm;

    @include respond-to('xs') {
      height: 48px;
      font-size: $font-size-md;
    }

    &.favorite-btn {
      &.active {
        background-color: color.adjust($danger, $lightness: 35%);
        border-color: $danger;
        color: $danger;
      }
    }
  }
}

.product-description {
  margin-bottom: $spacing-xl;

  h2 {
    font-size: $font-size-xl;
    margin-bottom: $spacing-md;
  }

  p {
    color: $dark-50;
    line-height: 1.6;
  }
}

.product-details {
  h2 {
    font-size: $font-size-xl;
    margin-bottom: $spacing-md;
  }

  .details-table {
    width: 100%;
    border-collapse: collapse;

    tr {
      border-bottom: 1px solid $light;

      &:last-child {
        border-bottom: none;
      }
    }

    th,
    td {
      padding: $spacing-sm;
      text-align: left;
    }

    th {
      width: 40%;
      color: $dark-30;
    }
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: space-between;

  h2 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: $dark;
  }
}

.close-button {
  background: none;
  border: none;
  color: $dark-50;
  cursor: pointer;
  padding: 0.5rem;
  font-size: 1.25rem;
  transition: color 0.2s;

  &:hover {
    color: $dark;
  }
}

.modal-body {
  padding: 1.5rem;

  p {
    margin: 0 0 1.5rem;
    color: $dark-70;
    text-align: center;
  }
}

.modal-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.login-button,
.register-button {
  padding: 0.75rem;
  border-radius: 4px;
  font-weight: 500;
  text-align: center;
  text-decoration: none;
  transition: all 0.2s;
}

.login-button {
  background: $primary;
  color: white;

  &:hover {
    background: darken($primary, 10%);
  }
}

.register-button {
  background: white;
  border: 1px solid $primary;
  color: $primary;

  &:hover {
    background: $light;
  }
}

.form-group {
  margin-bottom: 1rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }
  
  .form-control {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    
    &:focus {
      outline: none;
      border-color: #666;
    }
  }
}

.submit-button {
  padding: 0.75rem;
  border-radius: 4px;
  background: $primary;
  color: white;
  font-weight: 500;
  border: none;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  transition: all 0.2s;
  width: 100%;
  
  &:hover {
    background: var(--color-primary-dark, #388E3C);
  }
  
  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }
}

.login-link {
  text-align: center;
  font-size: 0.875rem;
  color: #666;
  margin-top: 1rem;
  
  a {
    color: $primary;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
}

.error-message {
  color: #e74c3c;
  margin: 1rem 0;
  text-align: center;
  font-size: 0.875rem;
}
</style>
