<template>
  <div class="filters-inner-content">
    <div class="filter-section">
      <h4 class="filter-title">Buscar</h4>
      <div class="search-input">
        <input type="text" v-model="filters.search" placeholder="Nome do produto..." class="form-control" @keydown.enter="applyFilters" />
        <font-awesome-icon icon="search" class="search-icon" @click="applyFilters"/>
      </div>
    </div>

    <div class="filter-section">
      <h4 class="filter-title">Categorias</h4>
      <div class="filter-options scrollable">
        <label class="checkbox-option" v-for="category in categories" :key="category.id">
          <input type="checkbox" :value="category.id.toString()" v-model="filters.categories" />
          <span class="checkbox-custom"></span>
          <span class="checkbox-label">{{ category.nome }}</span>
        </label>
      </div>
    </div>

    <div class="filter-section">
      <h4 class="filter-title">Preço</h4>
      <div class="price-range">
        <div class="price-inputs">
          <div class="input-group">
            <span class="currency">R$</span>
            <input type="number" v-model.number="filters.price.min" placeholder="Min" class="form-control" />
          </div>
          <span class="range-separator">-</span>
          <div class="input-group">
            <span class="currency">R$</span>
            <input type="number" v-model.number="filters.price.max" placeholder="Max" class="form-control" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  filters: Object,
  categories: Array,
});

const emit = defineEmits(['update:filters', 'apply-filters']);

const applyFilters = () => {
    emit('apply-filters');
}
</script>

<style lang="scss" scoped>
@use 'sass:color';
@use '@/assets/scss/variables' as *;
@use '@/assets/scss/mixins' as *;

.filters-inner-content {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.filter-section {
  .filter-title {
    font-size: $font-size-md;
    font-weight: 600;
    color: $dark;
    margin-bottom: $spacing-md;
    padding-bottom: $spacing-xs;
    border-bottom: 1px solid $primary-light-20;
  }
}

.search-input {
  position: relative;
  .form-control {
    padding-right: 2.5rem;
  }
  .search-icon {
    position: absolute;
    right: $spacing-md;
    top: 50%;
    transform: translateY(-50%);
    color: $dark;
    cursor: pointer;
    &:hover {
      color: $primary;
    }
  }
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;

  &.scrollable {
    max-height: 200px;
    overflow-y: auto;
    padding-right: $spacing-sm;
  }
}

.checkbox-option {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  cursor: pointer;
  position: relative;
  user-select: none;

  input[type="checkbox"] {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  .checkbox-label {
    font-size: $font-size-sm;
    color: $dark;
    transition: color 0.2s ease;
  }

  .checkbox-custom {
    height: 20px;
    width: 20px;
    background-color: #fff;
    border: 2px solid $primary-light-20;
    border-radius: $border-radius-sm;
    transition: all 0.2s ease;
    position: relative;

    &::after {
      content: "";
      position: absolute;
      display: none;
      left: 6px;
      top: 2px;
      width: 5px;
      height: 10px;
      border: solid white;
      border-width: 0 3px 3px 0;
      transform: rotate(45deg);
    }
  }
  
  input:checked ~ .checkbox-custom {
    background-color: $primary;
    border-color: $primary;
  }

  input:checked ~ .checkbox-custom::after {
    display: block;
  }

  &:hover {
    .checkbox-label {
      color: $primary;
    }
    .checkbox-custom {
      border-color: $primary;
    }
  }
}

.price-range .price-inputs {
  display: flex;
  align-items: center;
  gap: $spacing-sm;

  .input-group {
    display: flex;
    align-items: center;
    position: relative;
    flex: 1;
    .currency {
      position: absolute;
      left: $spacing-sm;
      font-size: $font-size-sm;
      color: $dark;
    }
    .form-control {
      padding-left: 2rem;
    }
  }
  .range-separator {
    color: $dark;
  }
}
</style> 