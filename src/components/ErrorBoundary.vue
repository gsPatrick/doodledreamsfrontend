<template>
  <div v-if="hasError" class="error-boundary">
    <h3><font-awesome-icon icon="exclamation-triangle" /> Algo deu errado</h3>
    <p>Ocorreu um erro ao carregar esta parte da página. Nossa equipe já foi notificada.</p>
    <p v-if="isDevelopment" class="error-details">
      <strong>Detalhes do Erro:</strong> {{ errorInfo }}
    </p>
    <button @click="resetError" class="btn btn-primary">Tentar Novamente</button>
  </div>
  <slot v-else></slot>
</template>

<script setup>
import { ref, onErrorCaptured } from 'vue';

const hasError = ref(false);
const errorInfo = ref(null);
const isDevelopment = process.env.NODE_ENV === 'development';

// Esta é a função mágica do Vue.
// Ela captura erros de qualquer componente descendente.
onErrorCaptured((err, instance, info) => {
  console.error("================ ERROR BOUNDARY CAPTUROU ================");
  console.error("ERRO:", err);
  console.error("INFO:", info);
  console.error("Componente que falhou:", instance);
  console.error("=======================================================");
  
  hasError.value = true;
  errorInfo.value = err.message;

  // Retornar 'false' impede que o erro se propague para cima e quebre a aplicação.
  return false;
});

const resetError = () => {
  hasError.value = false;
  errorInfo.value = null;
  // Poderíamos forçar um recarregamento, mas vamos deixar o usuário tentar de novo.
  // window.location.reload();
};
</script>

<style lang="scss" scoped>
@use '@/assets/scss/variables' as *;

.error-boundary {
  background-color: lighten($danger, 35%);
  border: 1px solid $danger;
  border-radius: $border-radius-lg;
  padding: $spacing-lg;
  margin: $spacing-lg 0;
  text-align: center;
  color: darken($danger, 15%);

  h3 {
    margin-top: 0;
    color: $danger;
  }

  .error-details {
    background-color: lighten($danger, 40%);
    padding: $spacing-sm;
    border-radius: $border-radius-md;
    margin-top: $spacing-md;
    font-family: monospace;
    font-size: $font-size-sm;
    text-align: left;
    white-space: pre-wrap;
  }

  .btn {
    margin-top: $spacing-md;
  }
}
</style>