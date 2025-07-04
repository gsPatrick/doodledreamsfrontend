<template>
  <div class="static-page">
    <div class="container">
      <h1 class="page-title">Termos de Uso</h1>
      
      <div class="content-box">
        <p class="intro">Bem-vindo à DoodleDreams! Ao acessar e utilizar nosso site, você concorda com os seguintes termos:</p>
        
        <div class="term-section">
          <h2>Uso do Conteúdo</h2>
          <p>Todo o conteúdo disponível (ilustrações, textos, PDFs, produtos digitais) é protegido por direitos autorais. Você pode utilizar nossos materiais para fins pessoais e não comerciais. Qualquer reprodução, redistribuição ou uso comercial requer autorização prévia.</p>
        </div>
        
        <div class="term-section">
          <h2>Conta e Compras</h2>
          <p>Ao criar uma conta, você se compromete a fornecer informações verdadeiras. Os produtos digitais serão disponibilizados após confirmação de pagamento. Não nos responsabilizamos por problemas decorrentes de informações incorretas.</p>
        </div>
        
        <div class="term-section">
          <h2>Propriedade Intelectual</h2>
          <p>As marcas, coleções e conteúdos são propriedade da DoodleDreams. O uso indevido poderá resultar em sanções legais.</p>
        </div>
        
        <div class="term-section">
          <h2>Modificações</h2>
          <p>Podemos alterar estes termos a qualquer momento. Recomendamos que você os revise periodicamente.</p>
        </div>
        
        <div class="term-section">
          <h2>Contato</h2>
          <p>Em caso de dúvidas, fale conosco pelo e-mail <a href="mailto:contato@doodledreams.com.br">contato@doodledreams.com.br</a>.</p>
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

.term-section {
  margin-bottom: 2rem;
  
  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: $primary;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid $light;
  }
  
  p {
    margin-bottom: 1rem;
  }
  
  a {
    color: $primary;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style> 