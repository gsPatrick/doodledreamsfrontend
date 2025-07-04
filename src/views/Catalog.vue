<template>
  <div class="catalog-page">
    <div class="container">
      <div class="breadcrumb">
        <router-link to="/" class="breadcrumb-item">Home</router-link>
        <span class="breadcrumb-separator"> / </span>
        <span class="breadcrumb-item active">Catálogo</span>
      </div>

      <div class="catalog-container">
        <!-- Sidebar para Desktop -->
        <aside class="filters-sidebar">
          <div class="filters-header">
            <h3>Filtros</h3>
            <button class="clear-filters" @click="clearFilters" v-if="hasActiveFilters">
              Limpar
            </button>
          </div>
          <FilterContent 
            :filters="filters" 
            :categories="categories"
            @update:filters="updateFilters"
            @apply-filters="applyFiltersAndCloseModal"
          />
        </aside>

        <main class="catalog-content">
          <div class="catalog-header">
            <div class="results-info">
               <button class="mobile-filters-btn" @click="showMobileFilters = true">
                <font-awesome-icon icon="filter" />
                <span>Filtros</span>
              </button>
              <span class="results-count">Mostrando {{ products.length }} de {{ pagination.total }} produtos</span>
            </div>
            <div class="catalog-actions">
              <div class="sort-select">
                <select v-model="filters.sortBy" class="form-control">
                  <option value="createdAt_desc">Mais Recentes</option>
                  <option value="lancamentos">Lançamentos</option>
                  <option value="mais-vendidos">Mais Vendidos</option>
                  <option value="preco_asc">Menor Preço</option>
                  <option value="preco_desc">Maior Preço</option>
                  <option value="nome_asc">Nome (A-Z)</option>
                  <option value="nome_desc">Nome (Z-A)</option>
                </select>
              </div>
            </div>
          </div>

          <div v-if="loading" class="loading-state">
             <font-awesome-icon icon="spinner" spin size="3x" />
             <p>Buscando produtos...</p>
          </div>
          <div v-else-if="error" class="empty-state">
            <font-awesome-icon :icon="['far', 'sad-tear']" size="4x"/>
            <h4>Ocorreu um erro</h4>
            <p>{{ error }}</p>
             <button class="btn btn-primary" @click="fetchProducts">
              Tentar Novamente
            </button>
          </div>
          <div v-else-if="!products.length" class="empty-state">
            <font-awesome-icon :icon="['far', 'sad-tear']" size="4x"/>
            <h4>Nenhum resultado encontrado</h4>
            <p>Tente ajustar seus filtros ou fazer uma nova busca.</p>
            <button class="btn btn-primary" @click="clearFilters">
              Limpar Filtros
            </button>
          </div>
          <div v-else class="products-grid">
            <ProductCard v-for="product in products" :key="product.id" :produto="product" />
          </div>

          <div class="pagination" v-if="pagination.totalPages > 1">
            <button class="pagination-arrow" :disabled="pagination.page === 1" @click="changePage(pagination.page - 1)">
              <font-awesome-icon icon="chevron-left" />
            </button>
            <button v-for="page in displayedPages" :key="page" class="pagination-number"
              :class="{ active: pagination.page === page }" @click="changePage(page)">
              {{ page }}
            </button>
            <button class="pagination-arrow" :disabled="pagination.page === pagination.totalPages"
              @click="changePage(pagination.page + 1)">
              <font-awesome-icon icon="chevron-right" />
            </button>
          </div>
        </main>
      </div>
    </div>

    <!-- Modal de Filtros para Mobile -->
    <div class="mobile-filters-modal" :class="{ active: showMobileFilters }" @click.self="showMobileFilters = false">
       <div class="modal-content-wrapper">
          <div class="modal-header">
            <h3>Filtros</h3>
            <button class="close-modal" @click="showMobileFilters = false">
              <font-awesome-icon icon="times" />
            </button>
          </div>
          <div class="modal-content">
             <FilterContent 
                :filters="filters" 
                :categories="categories"
                @update:filters="updateFilters"
             />
          </div>
           <div class="modal-footer">
                <button class="btn btn-secondary" @click="clearFilters">Limpar</button>
                <button class="btn btn-primary" @click="applyFiltersAndCloseModal">Ver {{ pagination.total }} produtos</button>
            </div>
       </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import debounce from 'lodash.debounce';
import ProductCard from '@/components/ProductCard.vue';
import FilterContent from '@/components/FilterContent.vue';
import produtoService from '@/services/produtoService';
import categoriaService from '@/services/categoriaService';

const route = useRoute();
const router = useRouter();

const products = ref([]);
const categories = ref([]);
const loading = ref(true);
const error = ref(null);
const showMobileFilters = ref(false);

const pagination = reactive({ page: 1, limit: 12, total: 0, totalPages: 1 });
const filters = reactive({
  search: '',
  categories: [],
  price: { min: null, max: null },
  sortBy: 'createdAt_desc',
});

const updateFiltersFromUrl = () => {
    filters.categories = [];

    const { query, params } = route;

    if (params.category && categories.value.length) {
        const categorySlug = params.category.toLowerCase();
        const foundCategory = categories.value.find(c => c.slug.toLowerCase() === categorySlug);
        if (foundCategory) {
            filters.categories = [foundCategory.id];
        }
    } 
    else if (query.categorias) {
        filters.categories = query.categorias.split(',').map(Number);
    }
    
    filters.search = query.busca || '';
    filters.price.min = query.precoMin ? Number(query.precoMin) : null;
    filters.price.max = query.precoMax ? Number(query.precoMax) : null;
    filters.sortBy = query.ordenarPor || 'createdAt_desc';
    pagination.page = query.page ? Number(query.page) : 1;
};

const fetchProducts = debounce(async () => {
  loading.value = true;
  error.value = null;

  const params = {
      page: pagination.page,
      limit: pagination.limit,
      busca: filters.search,
      categorias: filters.categories.join(','),
      precoMin: filters.price.min,
      precoMax: filters.price.max,
      ordenarPor: filters.sortBy,
  };
  
  const queryForRouter = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v != null && v !== '' && String(v).length > 0)
  );
  
  if (queryForRouter.page === 1) {
    delete queryForRouter.page;
  }

  if (JSON.stringify(queryForRouter) !== JSON.stringify(route.query)) {
      router.push({ query: queryForRouter });
  }

  try {
    const data = await produtoService.getProdutos(params);
    products.value = data.produtos;
    pagination.total = data.total;
    pagination.totalPages = data.totalPages;
  } catch (err) { 
    console.error("Erro ao buscar produtos:", err);
    error.value = err.response?.data?.erro || "Não foi possível carregar os produtos. Tente novamente mais tarde.";
  } 
  finally { loading.value = false; }
}, 300);

const fetchCategories = async () => {
    try {
        const data = await categoriaService.getCategorias();
        categories.value = data.categorias || data;
    } catch (err) { 
        console.error("Erro ao buscar categorias:", err);
    }
};

const clearFilters = () => {
    Object.assign(filters, { search: '', categories: [], price: { min: null, max: null }, sortBy: 'createdAt_desc' });
    pagination.page = 1;
    router.push({ path: '/catalogo', query: {} });
};

const changePage = (page) => {
    if (page > 0 && page <= pagination.totalPages) {
        pagination.page = page;
    }
};

const applyFiltersAndCloseModal = () => {
    pagination.page = 1;
    fetchProducts();
    showMobileFilters.value = false;
};

const updateFilters = (newFilters) => {
    Object.assign(filters, newFilters);
}

const displayedPages = computed(() => {
    const pages = [];
    const maxPagesToShow = 5;
    const half = Math.floor(maxPagesToShow / 2);
    let start = Math.max(1, pagination.page - half);
    let end = Math.min(pagination.totalPages, start + maxPagesToShow - 1);

    if (end - start < maxPagesToShow - 1) {
        start = Math.max(1, end - maxPagesToShow + 1);
    }
    
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
});

const hasActiveFilters = computed(() => {
    return filters.search !== '' ||
           filters.categories.length > 0 ||
           filters.price.min !== null ||
           filters.price.max !== null;
});

onMounted(async () => {
  await fetchCategories();
  updateFiltersFromUrl();
  fetchProducts();
});

watch([() => route.fullPath, categories], updateFiltersFromUrl, { immediate: true });
watch(filters, fetchProducts, { deep: true });
watch(() => pagination.page, fetchProducts);

</script>

<style lang="scss" scoped>
@use '@/assets/scss/variables' as *;
@use '@/assets/scss/mixins' as *;

.catalog-page {
  background-color: $gray-100;
  padding: $spacing-lg 0;
}

.breadcrumb {
  margin-bottom: $spacing-lg;
  font-size: $font-size-sm;
}

.catalog-container {
  display: grid;
  gap: $spacing-lg;

  @include respond-to(lg) {
    grid-template-columns: 280px 1fr;
  }
}

// Sidebar (Desktop)
.filters-sidebar {
  display: none; // Escondido por padrão (mobile-first)
  background-color: $white;
  border-radius: $border-radius-lg;
  padding: $spacing-lg;
  box-shadow: $shadow-sm;
  align-self: start; // Impede que estique

  @include respond-to(lg) {
    display: block;
    position: sticky;
    top: $spacing-lg;
  }

  .filters-header {
    @include flex(row, space-between, center);
    margin-bottom: $spacing-md;
    padding-bottom: $spacing-md;
    border-bottom: 1px solid $gray-200;

    h3 {
      margin: 0;
      font-size: $font-size-xl;
    }

    .clear-filters {
      font-size: $font-size-sm;
      color: $primary;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}

// Conteúdo Principal
.catalog-content {
  background-color: $white;
  border-radius: $border-radius-lg;
  padding: $spacing-md;
  box-shadow: $shadow-sm;
  
  @include respond-to(md) {
    padding: $spacing-lg;
  }
}

.catalog-header {
  @include flex(row, space-between, center);
  margin-bottom: $spacing-lg;
  gap: $spacing-md;
  flex-wrap: wrap;
}

.results-info {
  @include flex(row, flex-start, center);
  gap: $spacing-md;
}

.mobile-filters-btn {
  @include button-style($gray-200, $dark, $gray-300);
  padding: $spacing-sm $spacing-md;
  border-radius: $border-radius-md;
  display: inline-flex;
  align-items: center;
  gap: $spacing-sm;

  @include respond-to(lg) {
    display: none; // Esconde em telas grandes
  }
}

.results-count {
  font-size: $font-size-sm;
  color: $gray-600;
}

.sort-select {
  .form-control {
    min-width: 180px;
    border-radius: $border-radius-md;
  }
}

// Grade de Produtos
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: $spacing-md;
  
  @include respond-to(sm) {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: $spacing-lg;
  }
}

// Estados de Loading e Vazio
.loading-state, .empty-state {
  @include flex(column, center, center);
  padding: $spacing-4xl 0;
  text-align: center;
  color: $gray-500;

  p, h4 {
    margin-top: $spacing-md;
  }
  
  .btn {
    margin-top: $spacing-lg;
  }
}

// Paginação
.pagination {
  @include flex(row, center, center);
  margin-top: $spacing-xl;
  gap: $spacing-xs;
}

.pagination-number, .pagination-arrow {
  @include button-style($white, $dark, $gray-100);
  border: 1px solid $gray-300;
  width: 40px;
  height: 40px;
  border-radius: $border-radius-md;
  
  &.active {
    background-color: $primary;
    color: $white;
    border-color: $primary;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

// Modal de Filtros (Mobile)
.mobile-filters-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
  
  &.active {
    opacity: 1;
    pointer-events: auto;
  }
  
  .modal-content-wrapper {
    background: $white;
    width: 100%;
    max-width: 380px;
    height: 100%;
    display: flex;
    flex-direction: column;
    transform: translateX(100%);
    transition: transform 0.3s ease;
  }

  &.active .modal-content-wrapper {
    transform: translateX(0);
  }

  .modal-header {
    @include flex(row, space-between, center);
    padding: $spacing-md;
    border-bottom: 1px solid $gray-200;

    h3 { margin: 0; font-size: $font-size-xl; }
  }

  .modal-content {
    flex-grow: 1;
    overflow-y: auto;
    padding: $spacing-lg;
  }
  
  .modal-footer {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $spacing-md;
    padding: $spacing-md;
    border-top: 1px solid $gray-200;
  }
}
</style>
