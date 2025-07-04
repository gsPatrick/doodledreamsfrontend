<template>
  <div class="favorites-page container section">
    <h1 class="section-title">Meus Favoritos</h1>
    <p class="section-subtitle">Os produtos que você mais amou, todos em um só lugar.</p>

    <div v-if="loading" class="loading-state">
      <p>Carregando seus favoritos...</p>
    </div>

    <div v-else-if="favoritos.length > 0" class="products-grid">
      <ProductCard 
        v-for="item in favoritos" 
        :key="item.id" 
        :product="item" 
      />
    </div>

    <div v-else class="empty-state">
      <img src="https://placehold.co/300x300/EFEFEF/333?text=:( " alt="Nenhum favorito" class="empty-state-img">
      <h2 class="empty-state-title">Sua lista de favoritos está vazia</h2>
      <p class="empty-state-text">Explore nosso catálogo e adicione os produtos que você mais gostar clicando no coração.</p>
      <router-link to="/catalogo" class="btn btn-primary">Explorar Produtos</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import favoritoService from '@/services/favoritoService';
import ProductCard from '@/components/ProductCard.vue';

const favoritos = ref([]);
const loading = ref(true);

const fetchFavoritos = async () => {
  try {
    const response = await favoritoService.getFavoritos();
    favoritos.value = response.data;
  } catch (error) {
    console.error('Erro ao buscar favoritos:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchFavoritos);
</script>

<style lang="scss" scoped>
@use '@/assets/scss/variables' as *;
@use '@/assets/scss/mixins' as *;

.favorites-page {
  padding-top: $spacing-xl;
  padding-bottom: $spacing-2xl;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: $spacing-lg;
  margin-top: $spacing-xl;
}

.empty-state, .loading-state {
  @include flex(column, center, center);
  text-align: center;
  padding: $spacing-2xl 0;

  .empty-state-img {
    max-width: 200px;
    margin-bottom: $spacing-lg;
    opacity: 0.7;
    border-radius: $border-radius-full;
  }
  
  .empty-state-title {
    font-size: $font-size-2xl;
    margin-bottom: $spacing-sm;
  }

  .empty-state-text {
    max-width: 450px;
    margin-bottom: $spacing-lg;
    color: $dark-30;
  }
}
</style> 