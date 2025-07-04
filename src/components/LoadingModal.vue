<template>
  <div class="loading-modal-overlay">
    <div class="loading-modal-content">
      <div class="spinner"></div>
      <p>Processando seu pedido...</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoadingModal',
};
</script>

<style lang="scss" scoped>
.loading-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.loading-modal-content {
  text-align: center;
  color: white;
  
  p {
    margin-top: $spacing-md;
    font-size: $font-size-lg;
    font-weight: 500;
  }
}

.spinner {
  width: 60px;
  height: 60px;
  border: 5px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style> 