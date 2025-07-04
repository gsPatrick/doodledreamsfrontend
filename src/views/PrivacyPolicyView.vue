<template>
  <div class="static-page">
    <div class="container">
      <h1 class="page-title">Política de Privacidade</h1>
      
      <div class="content-box">
        <p class="intro">Na DoodleDreams, sua privacidade é uma prioridade. Veja como tratamos seus dados:</p>
        
        <div class="policy-section">
          <h2><font-awesome-icon icon="database" /> Coleta de Dados</h2>
          <p>Coletamos dados como nome, e-mail e histórico de compras para processar pedidos e personalizar sua experiência.</p>
        </div>
        
        <div class="policy-section">
          <h2><font-awesome-icon icon="tasks" /> Uso dos Dados</h2>
          <p>Seus dados são usados apenas para fins operacionais (como envio de produtos, newsletters e suporte ao cliente).</p>
        </div>
        
        <div class="policy-section">
          <h2><font-awesome-icon icon="share-alt" /> Compartilhamento</h2>
          <p>Não vendemos ou compartilhamos seus dados com terceiros, exceto quando necessário para serviços (como gateways de pagamento).</p>
        </div>
        
        <div class="policy-section">
          <h2><font-awesome-icon icon="lock" /> Segurança</h2>
          <p>Usamos tecnologias seguras para proteger suas informações.</p>
        </div>
        
        <div class="policy-section">
          <h2><font-awesome-icon icon="cookie-bite" /> Cookies</h2>
          <p>Utilizamos cookies para melhorar a navegação no site. Você pode ajustar as configurações no seu navegador.</p>
        </div>

        <div class="policy-section">
          <h2><font-awesome-icon icon="user-edit" /> Seus Direitos</h2>
          <p>Você pode solicitar a exclusão ou atualização de seus dados a qualquer momento.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
@use '@/assets/scss/variables' as *;

.static-page {
  padding: 4rem 0;
  background-color: #f8f9fa;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: $dark;
  text-align: center;
  margin-bottom: 2rem;
}

.content-box {
  background-color: $white;
  padding: 2.5rem;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-sm;
  font-size: 1.1rem;
  line-height: 1.8;
  color: $gray-700;
}

.intro {
  font-weight: 500;
  color: $dark;
  margin-bottom: 2rem;
  text-align: center;
}

.policy-section {
  margin-bottom: 2rem;
  
  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: $primary;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    
    svg {
      margin-right: 0.75rem;
      font-size: 1.3rem;
    }
  }
  
  p {
    margin-bottom: 1rem;
    padding-left: 2.05rem;
  }
}
</style> 