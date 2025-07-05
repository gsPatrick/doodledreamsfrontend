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
          <!-- CORREÇÃO: Adicionado v-if para garantir que as categorias existam antes de renderizar -->
          <FilterContent
            v-if="categories && categories.length > 0"
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
              <!-- CORREÇÃO: Usar optional chaining para segurança -->
              <span class="results-count">Mostrando {{ products?.length || 0 }} de {{ pagination?.total || 0 }} produtos</span>
            </div>
            <div class="catalog-actions">
              <div class="sort-select">
                <select v-model="filters.sortBy" @change="applySort" class="form-control">
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
             <!-- Ícone de erro pode ser diferente -->
             <font-awesome-icon icon="exclamation-circle" size="4x"/>
             <h4>Ocorreu um erro</h4>
             <p>{{ error }}</p>
             <button class="btn btn-primary" @click="fetchProducts(true)">
              Tentar Novamente
            </button>
          </div>
          <!-- CORREÇÃO: Usar optional chaining aqui também -->
          <div v-else-if="!products?.length" class="empty-state">
            <!-- Ícone pode ser diferente -->
            <font-awesome-icon icon="search" size="4x"/>
            <h4>Nenhum resultado encontrado</h4>
            <p>Tente ajustar seus filtros ou fazer uma nova busca.</p>
            <button class="btn btn-primary" @click="clearFilters">
              Limpar Filtros
            </button>
          </div>
          <div v-else class="products-grid">
            <!-- CORREÇÃO: Adicionado v-if para o produto e optional chaining na key -->
            <ProductCard v-for="product in products" :key="product?.id" v-if="product" :produto="product" />
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
             <!-- CORREÇÃO: Adicionado v-if aqui também -->
             <FilterContent
                v-if="categories && categories.length > 0"
                :filters="filters"
                :categories="categories"
                @update:filters="updateFilters"
             />
          </div>
           <div class="modal-footer">
                <button class="btn btn-secondary" @click="clearFilters">Limpar</button>
                <button class="btn btn-primary" @click="applyFiltersAndCloseModal">Ver {{ pagination.total || 0 }} produtos</button>
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

// CORREÇÃO: Inicializar com valores seguros
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

// CORREÇÃO: Função para atualizar URL de forma mais controlada
const updateRouterQuery = () => {
    const queryForRouter = {};
    if (filters.search) queryForRouter.busca = filters.search;
    if (filters.categories.length > 0) queryForRouter.categorias = filters.categories.join(',');
    if (filters.price.min) queryForRouter.precoMin = filters.price.min;
    if (filters.price.max) queryForRouter.precoMax = filters.price.max;
    if (filters.sortBy !== 'createdAt_desc') queryForRouter.ordenarPor = filters.sortBy;
    if (pagination.page > 1) queryForRouter.page = pagination.page;

    // Apenas atualiza a rota se houver mudança real para evitar loops
    if (JSON.stringify(queryForRouter) !== JSON.stringify(route.query)) {
        router.push({ query: queryForRouter });
    }
};

const updateFiltersFromUrl = () => {
    const { query, params } = route;

    // Atualiza as categorias baseado no slug da URL, se existir
    if (params.category && categories.value.length) {
        const categorySlug = params.category.toLowerCase();
        // CORREÇÃO: Usar optional chaining para evitar erro se 'c' for nulo
        const foundCategory = categories.value.find(c => c?.slug?.toLowerCase() === categorySlug);
        filters.categories = foundCategory ? [foundCategory.id] : [];
    }
    // Senão, usa as categorias da query
    else if (query.categorias) {
        filters.categories = query.categorias.split(',').map(Number);
    } else {
        filters.categories = [];
    }

    filters.search = query.busca || '';
    filters.price.min = query.precoMin ? Number(query.precoMin) : null;
    filters.price.max = query.precoMax ? Number(query.precoMax) : null;
    filters.sortBy = query.ordenarPor || 'createdAt_desc';
    pagination.page = query.page ? Number(query.page) : 1;
};

// CORREÇÃO: Simplificado e mais robusto. O debounce foi movido para o watcher.
const fetchProducts = async (forceUpdate = false) => {
  // Se não for uma atualização forçada, não faz nada (o watcher cuidará disso)
  if (!forceUpdate && loading.value) return;

  loading.value = true;
  error.value = null;

  try {
    const params = {
        page: pagination.page,
        limit: pagination.limit,
        busca: filters.search,
        categorias: filters.categories.join(','),
        precoMin: filters.price.min,
        precoMax: filters.price.max,
        ordenarPor: filters.sortBy,
    };
    const data = await produtoService.getProdutos(params);

    // CORREÇÃO: Garantir que os dados da API são arrays antes de atribuir
    products.value = Array.isArray(data.produtos) ? data.produtos : [];
    pagination.total = data.total || 0;
    pagination.totalPages = data.totalPages || 1;

  } catch (err) {
    console.error("Erro ao buscar produtos:", err);
    error.value = err.response?.data?.erro || "Não foi possível carregar os produtos. Tente novamente mais tarde.";
    products.value = []; // Limpa os produtos em caso de erro
  } finally {
    loading.value = false;
  }
};

const fetchCategories = async () => {
    try {
        const data = await categoriaService.getCategorias();
        // CORREÇÃO: Garantir que o resultado é sempre um array
        categories.value = Array.isArray(data) ? data : (Array.isArray(data.categorias) ? data.categorias : []);
    } catch (err) {
        console.error("Erro ao buscar categorias:", err);
        categories.value = []; // Estado seguro em caso de erro
    }
};

const clearFilters = () => {
    Object.assign(filters, { search: '', categories: [], price: { min: null, max: null }, sortBy: 'createdAt_desc' });
    pagination.page = 1;
    router.push({ path: '/catalogo', query: {} }); // O watcher cuidará de recarregar os produtos
};

const changePage = (page) => {
    if (page > 0 && page <= pagination.totalPages) {
        pagination.page = page;
        updateRouterQuery(); // Atualiza a URL e o watcher faz o resto
    }
};

const applySort = () => {
    pagination.page = 1;
    updateRouterQuery();
};

const applyFiltersAndCloseModal = () => {
    pagination.page = 1;
    updateRouterQuery();
    showMobileFilters.value = false;
};

const updateFilters = (newFilters) => {
    Object.assign(filters, newFilters);
};

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

// --- LÓGICA DE EXECUÇÃO E OBSERVAÇÃO ---
onMounted(async () => {
  loading.value = true;
  await fetchCategories();
  // Após carregar as categorias, podemos sincronizar os filtros com a URL
  updateFiltersFromUrl();
  // A busca inicial de produtos será acionada pelo watcher da rota
  loading.value = false;
});

// CORREÇÃO: Watcher de rota mais limpo e debounced para a busca
watch(
  () => route.fullPath,
  debounce((newPath, oldPath) => {
    if (newPath !== oldPath) {
      updateFiltersFromUrl();
      fetchProducts(true);
    }
  }, 150), // Pequeno debounce para evitar múltiplas chamadas rápidas
  { immediate: true } // Executa imediatamente na carga
);
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