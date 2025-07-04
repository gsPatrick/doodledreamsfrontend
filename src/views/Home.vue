<template>
  <div class="home">
    <!-- Banner Principal -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <div class="hero-image">
            <img src="/logo.svg" alt="Doodle Dreams - Livros Ilustrados" class="hero-img" />
          </div>
          <div class="hero-text">
            <h1 class="hero-title">Livros que despertam a imaginação</h1>
            <p class="hero-description">
              Descubra histórias mágicas e ilustrações encantadoras para todas as idades. Nossos
              livros são cuidadosamente criados para inspirar, educar e encantar.
            </p>
            <div class="hero-buttons">
              <router-link to="/catalogo" class="btn btn-primary btn-lg">
                Explorar Catálogo
              </router-link>
              <router-link to="/assinatura" class="btn btn-outline btn-lg">
                Conheça nossa Assinatura
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Categorias -->
    <section class="categories section">
      <div class="container">
        <h2 class="section-title">Nossas Coleções</h2>
        <p class="section-subtitle">Encontre o livro perfeito para cada idade e interesse</p>

        <div class="categories-grid">
          <router-link to="/catalogo?categorias=4" class="category-card">
            <div class="category-icon">
              <img src="/icon-1.jpg" alt="Infantil" class="category-img" />
            </div>
            <h3 class="category-title">Infantil</h3>
            <p class="category-description">3 a 8 anos</p>
            <span class="category-link">Ver coleção <font-awesome-icon icon="arrow-right" /></span>
          </router-link>

          <router-link to="/catalogo?categorias=5" class="category-card">
            <div class="category-icon">
              <img src="/icon-2.jpg" alt="Juvenil" class="category-img" />
            </div>
            <h3 class="category-title">Juvenil</h3>
            <p class="category-description">9 a 14 anos</p>
            <span class="category-link">Ver coleção <font-awesome-icon icon="arrow-right" /></span>
          </router-link>

          <router-link to="/catalogo?categorias=6" class="category-card">
            <div class="category-icon">
              <img src="/icon-3.jpg" alt="Adulto" class="category-img" />
            </div>
            <h3 class="category-title">Adulto</h3>
            <p class="category-description">Temas terapêuticos e artísticos</p>
            <span class="category-link">Ver coleção <font-awesome-icon icon="arrow-right" /></span>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Lançamentos -->
    <section class="new-releases section">
      <div class="container">
        <h2 class="section-title">Lançamentos</h2>
        <p class="section-subtitle">As novidades que acabaram de chegar</p>
        <div v-if="loadingLancamentos">Carregando...</div>
        <div v-else-if="lancamentos.length" class="products-grid">
          <ProductCard v-for="produto in lancamentos" :key="produto.id" :produto="produto" />
        </div>
        <div v-else>Nenhuma novidade por enquanto.</div>
      </div>
    </section>

    <!-- Mais Vendidos -->
    <section class="featured-products section">
      <div class="container">
        <h2 class="section-title">Mais Vendidos</h2>
        <p class="section-subtitle">Os livros favoritos dos nossos leitores</p>
        <div v-if="loadingMaisVendidos">Carregando...</div>
        <div v-else-if="maisVendidos.length" class="products-grid">
          <ProductCard v-for="produto in maisVendidos" :key="produto.id" :produto="produto" />
        </div>
        <div v-else class="text-center">Nossos produtos ainda estão aguardando seus fãs!</div>
      </div>
    </section>

    <!-- Assinatura -->
    <section class="subscription section">
      <div class="container">
        <div class="subscription-wrapper">
          <div class="subscription-image">
            <img
              src="/pinte-sonhos.jpg"
              alt="Clube de Assinatura Doodle Dreams"
              class="subscription-img"
            />
          </div>
          <div class="subscription-content">
            <h2 class="subscription-title">Clube de Assinatura</h2>
            <p class="subscription-description">
              Receba todo mês uma caixa especial com livros selecionados de acordo com a idade e
              interesses. Além dos livros, você recebe materiais exclusivos, atividades e surpresas!
            </p>
            <ul class="subscription-features">
              <li>
                <font-awesome-icon icon="check" />
                <span>Livros cuidadosamente selecionados</span>
              </li>
              <li>
                <font-awesome-icon icon="check" />
                <span>Materiais exclusivos para assinantes</span>
              </li>
              <li>
                <font-awesome-icon icon="check" />
                <span>Entrega em todo o Brasil</span>
              </li>
              <li>
                <font-awesome-icon icon="check" />
                <span>Cancele quando quiser</span>
              </li>
            </ul>
            <router-link to="/assinatura" class="btn btn-primary btn-lg">
              Conhecer planos
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Depoimentos -->
    <section class="testimonials section">
      <div class="container">
        <h2 class="section-title">O que dizem nossos leitores</h2>
        <p class="section-subtitle">Histórias que encantam crianças e adultos</p>

        <div class="testimonials-slider" ref="testimonialSlider">
          <div class="testimonials-wrapper" :style="testimonialSliderStyle">
            <div v-for="(testimonial, index) in testimonials" :key="index" class="testimonial-item">
              <div class="testimonial-content">
                <div class="testimonial-rating">
                  <font-awesome-icon
                    v-for="i in 5"
                    :key="i"
                    icon="star"
                    :class="{ 'star-filled': i <= testimonial.rating }"
                  />
                </div>
                <p class="testimonial-text">{{ testimonial.text }}</p>
                <div class="testimonial-author">
                  <div class="author-name">{{ testimonial.author }}</div>
                  <div class="author-info">{{ testimonial.info }}</div>
                </div>
              </div>
            </div>
          </div>

          <button
            class="slider-control prev"
            @click="prevTestimonial"
            :disabled="currentTestimonial === 0"
          >
            <font-awesome-icon icon="chevron-left" />
          </button>

          <button
            class="slider-control next"
            @click="nextTestimonial"
            :disabled="currentTestimonial >= testimonials.length - testimonialItemsPerView"
          >
            <font-awesome-icon icon="chevron-right" />
          </button>
        </div>

        <div class="slider-dots">
          <button
            v-for="i in Math.ceil(testimonials.length / testimonialItemsPerView)"
            :key="i"
            class="dot"
            :class="{ active: Math.floor(currentTestimonial / testimonialItemsPerView) === i - 1 }"
            @click="goToTestimonial((i - 1) * testimonialItemsPerView)"
          ></button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import ProductCard from '@/components/ProductCard.vue'
import produtoService from '@/services/produtoService'
import { useCart } from '@/composables/useCart'

export default {
  name: 'Home',
  components: {
    ProductCard,
  },
  setup() {
    const lancamentos = ref([])
    const maisVendidos = ref([])
    const loadingLancamentos = ref(true)
    const loadingMaisVendidos = ref(true)
    const currentTestimonial = ref(0)
    const testimonialItemsPerView = ref(3)
    const testimonialSlideWidth = ref(0)

    const mapApiProduct = apiProduct => {
      const getImageUrl = url => {
        if (!url) return 'https://placehold.co/400x400/EFEFEF/333?text=Sem+Imagem'
        return url
      }

      let imagens = []

      if (apiProduct.imagens && apiProduct.imagens.length > 0) {
        imagens = apiProduct.imagens.map(getImageUrl)
      } else if (apiProduct.ArquivoProdutos && apiProduct.ArquivoProdutos.length > 0) {
        const imageFiles = apiProduct.ArquivoProdutos.filter(f => f.tipo === 'imagem')
        imagens =
          imageFiles.length > 0
            ? imageFiles.map(img => getImageUrl(img.url))
            : [getImageUrl(null)]
      } else {
        imagens = [getImageUrl(null)]
      }

      // Obter o preço do produto (pode estar em diferentes locais dependendo da API)
      let preco = 0
      if (apiProduct.preco !== undefined && apiProduct.preco !== null) {
        preco = parseFloat(apiProduct.preco)
      } else if (apiProduct.price !== undefined && apiProduct.price !== null) {
        preco = parseFloat(apiProduct.price)
      } else if (apiProduct.variacoes && apiProduct.variacoes.length > 0) {
        const precos = apiProduct.variacoes
          .map(v => parseFloat(v.preco || 0))
          .filter(p => p > 0)
        preco = precos.length > 0 ? Math.min(...precos) : 0
      }

      return {
        id: apiProduct.id,
        nome: apiProduct.nome,
        title: apiProduct.nome,
        preco: preco,
        price: preco,
        imagens: imagens,
        ArquivoProdutos: apiProduct.ArquivoProdutos || [],
        category: apiProduct.categoria || apiProduct.categoriaId,
        featured: apiProduct.featured || false,
        isNew: new Date(apiProduct.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        isBestseller: false,
        discount: apiProduct.desconto || null,
        ageRange: apiProduct.faixaEtaria || null,
        rating: 4.5, // Mock
        reviewCount: 120, // Mock
        oldPrice: apiProduct.precoAntigo || null,
      }
    }

    const fetchLancamentos = async () => {
      try {
        const produtos = await produtoService.getLancamentos(4)
        lancamentos.value = produtos.map(mapApiProduct)
      } catch (error) {
        console.error('Erro ao buscar lançamentos:', error)
      } finally {
        loadingLancamentos.value = false
      }
    }

    const fetchMaisVendidos = async () => {
      try {
        const produtos = await produtoService.getMaisVendidos(4)
        maisVendidos.value = produtos.map(p => {
          const product = mapApiProduct(p)
          product.isBestseller = true
          return product
        })
      } catch (error) {
        console.error('Erro ao buscar mais vendidos:', error)
      } finally {
        loadingMaisVendidos.value = false
      }
    }

    const { addToCart } = useCart()

    const testimonialSlider = ref(null)

    const testimonialSliderStyle = computed(() => ({
      transform: `translateX(-${currentTestimonial.value * (100 / testimonialItemsPerView.value)}%)`,
    }))

    const prevTestimonial = () => {
      if (currentTestimonial.value > 0) {
        currentTestimonial.value--
      }
    }

    const nextTestimonial = () => {
      if (currentTestimonial.value < testimonials.length - testimonialItemsPerView.value) {
        currentTestimonial.value++
      }
    }

    const goToTestimonial = index => {
      currentTestimonial.value = index
    }

    const updateTestimonialItemsPerView = () => {
      if (window.innerWidth >= 1024) {
        testimonialItemsPerView.value = 3
      } else if (window.innerWidth >= 768) {
        testimonialItemsPerView.value = 2
      } else {
        testimonialItemsPerView.value = 1
      }
    }

    onMounted(() => {
      fetchLancamentos()
      fetchMaisVendidos()
      updateTestimonialItemsPerView()
      window.addEventListener('resize', updateTestimonialItemsPerView)
    })

    const testimonials = [
      {
        rating: 5,
        text: 'Os livros são maravilhosos! Minha filha adora as histórias e as ilustrações são encantadoras.',
        author: 'Ana Silva',
        info: 'Mãe da Maria, 6 anos',
      },
      {
        rating: 5,
        text: 'A qualidade do material é excelente e as histórias são muito bem elaboradas. Super recomendo!',
        author: 'Carlos Santos',
        info: 'Pai do Pedro, 4 anos',
      },
      {
        rating: 5,
        text: 'A assinatura mensal é incrível! As crianças ficam ansiosas para receber a nova caixa todo mês.',
        author: 'Patricia Lima',
        info: 'Mãe do Lucas e da Julia',
      },
    ]

    return {
      lancamentos,
      maisVendidos,
      loadingLancamentos,
      loadingMaisVendidos,
      currentTestimonial,
      testimonialItemsPerView,
      testimonialSlideWidth,
      testimonialSlider,
      testimonialSliderStyle,
      prevTestimonial,
      nextTestimonial,
      goToTestimonial,
      updateTestimonialItemsPerView,
      testimonials,
      addToCart,
    }
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.updateTestimonialItemsPerView)
  },
}
</script>

<style lang="scss" scoped>
@use 'sass:color';
@use '@/assets/scss/variables' as *;

.hero {
  padding: $spacing-xl 0;
  background-color: $light;

  @include respond-to(md) {
    padding: $spacing-2xl 0;
  }
}

.hero-content {
  @include flex(column, center, center);
  text-align: center;

  @include respond-to(lg) {
    @include flex(row, space-between, center);
    text-align: left;
  }
}

.hero-image {
  margin-bottom: $spacing-xl;
  max-width: 100%;

  @include respond-to(lg) {
    margin-bottom: 0;
    margin-right: $spacing-2xl;
    max-width: 50%;
  }

  .hero-img {
    max-width: 100%;
    border-radius: $border-radius-lg;
 
  }
}

.hero-text {
  @include respond-to(lg) {
    max-width: 50%;
  }
}

.hero-title {
  font-size: $font-size-3xl;
  margin-bottom: $spacing-md;
  color: #2d3748;

  @include respond-to(md) {
    font-size: 3rem;
  }

  @include respond-to(lg) {
    font-size: $font-size-5xl;
  }
}

.hero-description {
  font-size: $font-size-md;
  margin-bottom: $spacing-lg;
  color: color.adjust($dark, $lightness: 20%);

  @include respond-to(md) {
    font-size: $font-size-lg;
  }
}

.hero-buttons {
  @include flex(column, center, center);

  .btn {
    margin-bottom: $spacing-sm;
    width: 100%;
  }

  @include respond-to(sm) {
    @include flex(row, center, center);

    .btn {
      margin-right: $spacing-md;
      margin-bottom: 0;
      width: auto;
    }
  }

  @include respond-to(lg) {
    justify-content: flex-start;
  }
}

.categories-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: $spacing-lg;
  margin-top: $spacing-xl;

  @include respond-to(md) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.category-card {
  background-color: #ffffff;
  border-radius: $border-radius-lg;
  padding: $spacing-xl;
  text-align: center;
  box-shadow: $shadow-md;
  transition: $transition-base;

  &:hover {
    transform: translateY(-10px);
    box-shadow: $shadow-lg;

    .category-icon {
      background-color: $primary;
      color: #ffffff;
    }

    .category-link {
      color: $primary;
    }
  }
}

.category-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: rgba($primary, 0.1);
  color: $primary;
  @include flex(row, center, center);
  margin: 0 auto $spacing-md;
  transition: $transition-base;

  svg {
    font-size: $font-size-2xl;
  }
}

.category-title {
  font-size: $font-size-xl;
  margin-bottom: $spacing-xs;
  color: #2d3748;
}

.category-description {
  font-size: $font-size-sm;
  color: color.adjust($dark, $lightness: 20%);
  margin-bottom: $spacing-md;
}

.category-link {
  font-size: $font-size-sm;
  font-weight: 600;
  color: color.adjust($dark, $lightness: 20%);
  transition: $transition-base;

  svg {
    margin-left: $spacing-xs;
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: translateX(3px);
  }
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: $spacing-lg;
  margin-top: $spacing-xl;
}

.subscription {
  background-color: $light;
}

.subscription-wrapper {
  @include flex(column, center, center);

  @include respond-to(lg) {
    @include flex(row, space-between, center);
  }
}

.subscription-image {
  margin-bottom: $spacing-xl;
  max-width: 100%;

  @include respond-to(lg) {
    margin-bottom: 0;
    margin-right: $spacing-2xl;
    max-width: 45%;
  }

  .subscription-img {
    max-width: 100%;
    border-radius: $border-radius-lg;
    box-shadow: $shadow-lg;
  }
}

.subscription-content {
  @include respond-to(lg) {
    max-width: 55%;
  }
}

.subscription-title {
  font-size: $font-size-3xl;
  margin-bottom: $spacing-md;
  color: #2d3748;
}

.subscription-description {
  font-size: $font-size-md;
  margin-bottom: $spacing-lg;
  color: color.adjust($dark, $lightness: 20%);
}

.subscription-features {
  list-style: none;
  padding: 0;
  margin: $spacing-lg 0;
  li {
    display: flex;
    align-items: center;
    margin-bottom: $spacing-sm;
    font-size: $font-size-md;
    color: color.adjust($dark, $lightness: 30%);
    svg {
      color: $secondary;
      margin-right: $spacing-sm;
    }
  }
}

.testimonials.section {
  padding-bottom: $spacing-xl;
}

.testimonials-slider {
  position: relative;
  overflow: hidden;
  margin: $spacing-xl ($spacing-md * -1);
  padding: 0 $spacing-md;
}

.testimonials-wrapper {
  display: flex;
  transition: transform 0.5s ease;
}

.testimonial-item {
  flex: 0 0 auto;
  width: 100%;
  padding: 0 $spacing-md;

  @include respond-to(sm) {
    width: 50%;
  }

  @include respond-to(lg) {
    width: 33.333%;
  }
}

.testimonial-content {
  background-color: #ffffff;
  border-radius: $border-radius-lg;
  padding: $spacing-lg;
  box-shadow: $shadow-md;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.testimonial-rating {
  margin-bottom: $spacing-md;

  svg {
    color: color.adjust($dark, $lightness: 60%);
    margin-right: 2px;

    &.star-filled {
      color: #ffd700; // Cor dourada para estrelas
    }
  }
}

.testimonial-text {
  font-size: $font-size-md;
  font-style: italic;
  color: color.adjust($dark, $lightness: 20%);
  margin-bottom: $spacing-md;
  flex-grow: 1;
}

.testimonial-author {
  margin-top: auto;
}

.author-name {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: $spacing-xs;
}

.author-info {
  font-size: $font-size-sm;
  color: color.adjust($dark, $lightness: 30%);
}

.slider-control {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #ffffff;
  color: #2d3748;
  @include flex(row, center, center);
  box-shadow: $shadow-md;
  z-index: 10;
  transition: $transition-base;

  &.prev {
    left: $spacing-md;
  }

  &.next {
    right: $spacing-md;
  }

  &:hover:not(:disabled) {
    background-color: $primary;
    color: #ffffff;
    transform: translateY(-50%) scale(1.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.slider-dots {
  @include flex(row, center, center);
  margin-top: $spacing-lg;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: color.adjust($dark, $lightness: 60%);
  margin: 0 $spacing-xs;
  transition: $transition-base;

  &:hover {
    background-color: color.adjust($primary, $lightness: 20%);
  }

  &.active {
    background-color: $primary;
    transform: scale(1.2);
  }
}

.newsletter-section {
  background-color: $primary;
  padding: $spacing-2xl 0;
  margin-top: $spacing-3xl;
}

.newsletter-wrapper {
  @include flex(column, center, center);
  text-align: center;

  @include respond-to(md) {
    @include flex(row, space-between, center);
    text-align: left;
  }
}

.newsletter-content {
  margin-bottom: $spacing-lg;

  @include respond-to(md) {
    margin-bottom: 0;
    margin-right: $spacing-xl;
  }
}

.newsletter-title {
  font-size: $font-size-2xl;
  color: #ffffff;
  margin-bottom: $spacing-sm;
}

.newsletter-text {
  color: color.adjust($dark, $lightness: 20%);
  margin-top: -$spacing-xs;
  margin-bottom: 0;
}

.newsletter-form {
  @include flex(column, center, stretch);
  width: 100%;

  @include respond-to(md) {
    @include flex(row, flex-start, flex-end);
    max-width: 500px;
  }

  .form-group {
    width: 100%;
    margin-bottom: $spacing-sm;

    @include respond-to(md) {
      margin-bottom: 0;
      margin-right: $spacing-sm;
    }
  }

  .btn {
    width: 100%;

    @include respond-to(md) {
      width: auto;
    }
  }

  .form-control {
    background-color: $white;
    border-color: $light;
    &:focus {
      border-color: $primary;
    }
    &::placeholder {
      color: color.adjust($dark, $lightness: 60%);
    }
  }
}

.home-container {
  .section-title {
    color: $dark;
  }

  .section-description {
    color: $dark-20;
  }

  .featured-products {
    background-color: $white;

    .product-card {
      color: $white;
    }
  }

  .category-section {
    color: $dark;

    .category-description {
      color: $dark-30;
    }

    .category-stats {
      color: $dark-20;
    }
  }

  .testimonials {
    background-color: $white;

    .testimonial-text {
      color: $dark-60;
    }

    .testimonial-author {
      color: $dark-20;
    }
  }

  .newsletter {
    color: $dark;

    p {
      color: $dark-30;
    }

    .form-control {
      background-color: $white;
      color: $dark;
    }
  }

  .cta-section {
    color: $white;
  }

  .rating-stars {
    color: $gold;
  }

  .benefits-section {
    color: $dark;

    .benefit-description {
      color: $dark-30;
    }
  }

  .featured-categories {
    background-color: $white;
    color: $dark;

    .category-link {
      &:hover {
        color: $white;
      }
    }
  }

  .trending-section {
    background-color: $dark-60;
  }

  .promotion-banner {
    background-color: $primary-light-20;
  }
}
</style>
