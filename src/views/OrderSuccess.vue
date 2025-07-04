<template>
  <div class="order-success-page">
    <div class="container">
      <div class="success-card">
        <div class="icon-container">
          <font-awesome-icon icon="check-circle" class="success-icon" />
        </div>
        <h2>Pedido Realizado com Sucesso!</h2>
        <p>Seu pedido nº <strong>{{ orderId }}</strong> foi criado. Para concluir a compra, prossiga com o pagamento.</p>
        <div class="actions">
          <a :href="paymentUrl" class="btn btn-primary btn-lg" target="_blank" rel="noopener noreferrer">
            <font-awesome-icon icon="dollar-sign" />
            Pagar Agora
          </a>
          <router-link to="/perfil" class="btn btn-secondary">
            <font-awesome-icon icon="user" />
            Ver Meus Pedidos
          </router-link>
        </div>
        <p class="info">Você será redirecionado para o ambiente seguro do nosso provedor de pagamentos para concluir a transação.</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderSuccess',
  computed: {
    orderId() {
      return this.$route.query.orderId;
    },
    paymentUrl() {
      return this.$route.query.paymentUrl;
    }
  },
  created() {
    if (!this.orderId || !this.paymentUrl) {
      // Se não houver dados, redireciona para a home para evitar página em branco
      this.$router.push('/');
    }
  }
}
</script>

<style lang="scss" scoped>
.order-success-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: $spacing-xl 0;
}

.success-card {
  @include card-base;
  text-align: center;
  max-width: 500px;
  margin: 0 auto;
  padding: $spacing-xl;
}

.icon-container {
  margin-bottom: $spacing-lg;
  .success-icon {
    font-size: 4rem;
    color: $success;
  }
}

h2 {
  font-size: $font-size-xl;
  margin-bottom: $spacing-md;
}

p {
  font-size: $font-size-lg;
  color: gray;
  margin-bottom: $spacing-xl;

  &.info {
    font-size: $font-size-sm;
    margin-top: $spacing-lg;
    margin-bottom: 0;
  }
}

.actions {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;

  @include respond-to('sm') {
    flex-direction: row;
    justify-content: center;
  }

  .btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $spacing-sm;
  }
}
</style> 