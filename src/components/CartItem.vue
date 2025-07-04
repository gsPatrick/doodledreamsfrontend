<template>
  <div class="cart-item">
    <div class="product-details">
      <router-link
        :to="{ name: 'ProductDetail', params: { id: item.productId } }"
        class="product-image-link"
      >
         </router-link>
      <div class="product-info">
        <router-link
          :to="{ name: 'ProductDetail', params: { id: item.productId } }"
          class="product-title-link"
        >
          <h3 class="product-title">{{ item.product.title }}</h3>
        </router-link>
        <div class="product-meta">
          <span v-if="item.product.category" class="meta-item">
            Categoria: {{ getCategoryLabel(item.product.category) }}
          </span>
          <button
            class="remove-item-mobile"
            @click="
              emit('removeItem', { productId: item.productId, variationId: item.variationId })
            "
          >
            Remover
          </button>
        </div>
        <div class="price-unit-mobile">R$ {{ formatPrice(item.price) }}</div>
      </div>
    </div>

    <div class="price-unit-desktop">
      <p>R$ {{ formatPrice(item.price) }}</p>
    </div>

    <div class="quantity-control">
      <button class="quantity-btn" @click="decreaseQuantity" :disabled="localQuantity <= 1">
        <font-awesome-icon icon="minus" />
      </button>
      <input
        type="number"
        v-model.number="localQuantity"
        min="1"
        class="quantity-input"
        @change="handleQuantityUpdate"
      />
      <button class="quantity-btn" @click="increaseQuantity">
        <font-awesome-icon icon="plus" />
      </button>
    </div>

    <div class="total-price">
      <p>R$ {{ formatPrice(item.price * localQuantity) }}</p>
    </div>

    <div class="item-actions">
      <button
        class="remove-item-desktop"
        @click="emit('removeItem', { productId: item.productId, variationId: item.variationId })"
        title="Remover item"
      >
        <font-awesome-icon icon="times" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update-quantity', 'removeItem'])

const localQuantity = ref(props.item.quantity)

const mainImage = computed(() => {
  const imagePath = props.item.product?.image
  if (!imagePath) {
    return 'https://placehold.co/400x400/EFEFEF/333?text=Sem+Imagem'
  }
  return imagePath
})

const formatPrice = price => {
  if (typeof price !== 'number') return '0,00'
  return price.toFixed(2).replace('.', ',')
}

const handleQuantityUpdate = () => {
  if (localQuantity.value < 1) {
    localQuantity.value = 1
  }
  emit('update-quantity', {
    productId: props.item.productId,
    variationId: props.item.variationId,
    quantity: localQuantity.value,
  })
}

const increaseQuantity = () => {
  localQuantity.value++
  handleQuantityUpdate()
}

const decreaseQuantity = () => {
  if (localQuantity.value > 1) {
    localQuantity.value--
    handleQuantityUpdate()
  }
}

const getCategoryLabel = category => {
  const categories = {
    infantil: 'Infantil',
    juvenil: 'Juvenil',
    adulto: 'Adulto',
  }
  return categories[category] || category
}

watch(
  () => props.item.quantity,
  newQuantity => {
    localQuantity.value = newQuantity
  }
)
</script>

<style lang="scss" scoped>
@use '@/assets/scss/variables' as *;
@use '@/assets/scss/mixins' as *;

.cart-item {
  display: grid;
  grid-template-columns: 2.5fr 1fr 1.5fr 1fr 0.5fr;
  gap: $spacing-md;
  align-items: center;
  padding: $spacing-lg 0;
  border-bottom: 1px solid $gray-200;

  &:last-child {
    border-bottom: none;
  }

  p {
    margin: 0;
    font-size: $font-size-md;
    color: $dark;
  }
}

.product-details {
  display: flex;
  align-items: center;
  gap: $spacing-md;
}

.product-image-link {
  flex-shrink: 0;
}

.product-image {
  width: 90px;
  height: 90px;
  object-fit: cover;
  border-radius: $border-radius-md;
  border: 1px solid $gray-200;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
  min-width: 0;
}

.product-title {
  font-size: $font-size-md;
  font-weight: 600;
  margin: 0;
  @include truncate(2);
}

.product-meta {
  font-size: $font-size-sm;
  color: $gray-600;
}

.quantity-control {
  display: flex;
  align-items: center;
  justify-content: center;

  .quantity-input {
    width: 45px;
    height: 35px;
    text-align: center;
    border: 1px solid $gray-300;
    border-radius: $border-radius-sm;
    margin: 0 $spacing-xs;

    &:focus {
      outline: none;
      border-color: $primary;
    }
  }

  .quantity-btn {
    width: 35px;
    height: 35px;
    border-radius: $border-radius-sm;
    background-color: $gray-100;
    color: $gray-700;
    @include flex(row, center, center);
    transition: background-color 0.2s;

    &:hover:not(:disabled) {
      background-color: $primary-light-1;
    }
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}

.total-price,
.price-unit-desktop {
  text-align: center;
  font-weight: 600;
}

.item-actions {
  text-align: right;
  padding-right: 15px;
}

.remove-item-desktop {
  color: $gray-500;
  font-size: 1.2rem;
  transition: color 0.2s;
  &:hover {
    color: $danger;
  }
}

.remove-item-mobile,
.price-unit-mobile {
  display: none;
}

// Responsive (Mobile)
@media (max-width: #{$breakpoint-md - 1}) {
  .cart-item {
    grid-template-columns: 1fr;
    gap: $spacing-sm;
    background-color: $white;
    border: 1px solid $gray-200;
    border-radius: $border-radius-lg;
    padding: $spacing-md;
    margin-bottom: $spacing-md;
  }

  .product-details {
    grid-column: 1 / -1;
    gap: $spacing-sm;
  }

  .product-image {
    width: 80px;
    height: 80px;
  }

  .product-title {
    font-size: $font-size-base;
  }

  .remove-item-mobile,
  .price-unit-mobile {
    display: block;
  }

  .price-unit-mobile {
    font-size: $font-size-md;
    font-weight: 600;
    color: $primary;
    margin-top: $spacing-xs;
  }

  .remove-item-mobile {
    font-size: $font-size-sm;
    color: $danger;
    margin-top: $spacing-xs;
    text-decoration: underline;
  }

  .quantity-control {
    grid-column: 1 / -1;
    justify-content: flex-start;
    margin-top: $spacing-sm;
    padding-top: $spacing-sm;
    border-top: 1px solid $gray-200;
  }

  .price-unit-desktop,
  .total-price,
  .item-actions {
    display: none;
  }
}
</style>
