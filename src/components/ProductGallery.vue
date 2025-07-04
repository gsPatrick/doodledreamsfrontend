<template>
  <div class="product-gallery">
    <div class="gallery-main">
      <div class="gallery-main-image">
        <img :src="currentImage" :alt="product.title" class="main-image" ref="mainImage">
        <div class="zoom-overlay" v-if="zoomEnabled" ref="zoomOverlay"></div>
      </div>
      <div class="gallery-controls">
        <button class="gallery-control prev" @click="prevImage" :disabled="currentIndex === 0">
          <font-awesome-icon icon="chevron-left" />
        </button>
        <button class="gallery-control next" @click="nextImage" :disabled="currentIndex === images.length - 1">
          <font-awesome-icon icon="chevron-right" />
        </button>
      </div>
    </div>
    
    <div class="gallery-thumbnails">
      <div 
        v-for="(image, index) in images" 
        :key="index" 
        class="gallery-thumbnail" 
        :class="{ active: currentIndex === index }"
        @click="setCurrentImage(index)"
      >
        <img :src="image" :alt="`${product.title} - Imagem ${index + 1}`">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductGallery',
  props: {
    product: {
      type: Object,
      required: true
    },
    images: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      currentIndex: 0,
      zoomEnabled: false,
      zoomLevel: 2 // Nível de zoom
    }
  },
  computed: {
    currentImage() {
      return this.images[this.currentIndex]
    }
  },
  methods: {
    setCurrentImage(index) {
      this.currentIndex = index
    },
    nextImage() {
      if (this.currentIndex < this.images.length - 1) {
        this.currentIndex++
      }
    },
    prevImage() {
      if (this.currentIndex > 0) {
        this.currentIndex--
      }
    },
    initZoom() {
      const mainImage = this.$refs.mainImage
      const zoomOverlay = this.$refs.zoomOverlay
      
      if (!mainImage || !zoomOverlay) return
      
      mainImage.addEventListener('mouseenter', () => {
        this.zoomEnabled = true
      })
      
      mainImage.addEventListener('mouseleave', () => {
        this.zoomEnabled = false
      })
      
      mainImage.addEventListener('mousemove', (e) => {
        if (!this.zoomEnabled) return
        
        // Obter posição do mouse relativa à imagem
        const rect = mainImage.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        
        // Calcular posição percentual
        const xPercent = x / rect.width * 100
        const yPercent = y / rect.height * 100
        
        // Aplicar zoom
        zoomOverlay.style.backgroundImage = `url(${this.currentImage})`
        zoomOverlay.style.backgroundPosition = `${xPercent}% ${yPercent}%`
        zoomOverlay.style.backgroundSize = `${this.zoomLevel * 100}%`
        zoomOverlay.style.left = `${x}px`
        zoomOverlay.style.top = `${y}px`
      })
    }
  },
  mounted() {
    this.initZoom()
  },
  updated() {
    this.$nextTick(() => {
      this.initZoom()
    })
  }
}
</script>

<style lang="scss">
.product-gallery {
  margin-bottom: $spacing-xl;
}

.gallery-main {
  position: relative;
  margin-bottom: $spacing-md;
  border-radius: $border-radius-lg;
  overflow: hidden;
  box-shadow: $shadow-md;
}

.gallery-main-image {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 100%; // Proporção 1:1
  overflow: hidden;
  
  .main-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
    cursor: zoom-in;
  }
}

.zoom-overlay {
  position: absolute;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  pointer-events: none;
  transform: translate(-50%, -50%);
  border: 2px solid #ffffff;
  box-shadow: $shadow-md;
  background-repeat: no-repeat;
  z-index: 10;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.gallery-main-image:hover {
  .zoom-overlay {
    opacity: 1;
  }
}

.gallery-controls {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  transform: translateY(-50%);
  @include flex(row, space-between, center);
  padding: 0 $spacing-sm;
}

.gallery-control {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(#ffffff, 0.8);
  color: #2d3748;;
  @include flex(row, center, center);
  box-shadow: $shadow-md;
  transition: $transition-base;
  
  &:hover:not(:disabled) {
    background-color: $primary;
    color: #ffffff;
    transform: scale(1.1);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.gallery-thumbnails {
  @include flex(row, flex-start, center);
  flex-wrap: wrap;
  margin: -$spacing-xs;
}

.gallery-thumbnail {
  width: calc(20% - #{$spacing-sm});
  margin: $spacing-xs;
  border-radius: $border-radius-md;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: $transition-base;
  
  img {
    width: 100%;
    height: 80px;
    object-fit: cover;
  }
  
  &:hover {
    transform: translateY(-2px);
  }
  
  &.active {
    border-color: $primary;
  }
}

@include respond-to(md) {
  .gallery-main-image {
    padding-bottom: 75%; // Proporção 4:3 em telas maiores
  }
  
  .gallery-thumbnail {
    width: calc(16.666% - #{$spacing-sm});
    
    img {
      height: 100px;
    }
  }
}
</style>

