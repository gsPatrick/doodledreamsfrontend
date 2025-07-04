<template>
  <div class="about-us-page">
    <div class="container">
      <section class="hero-section">
        <h1 class="page-title">Sobre a DoodleDreams</h1>
        <p class="subtitle">Transformando a arte de colorir em uma experiência significativa para todas as idades.</p>
      </section>

      <section class="content-section">
        <div class="text-content">
          <p>A DoodleDreams nasceu do desejo de transformar a arte de colorir em uma experiência significativa para todas as idades. Nossos livros unem ilustrações encantadoras a histórias que promovem alfabetização, expressão emocional e criatividade.</p>
          <p>Oferecemos coleções para crianças, jovens e adultos — cada uma pensada com carinho, propósito e muito afeto.</p>
        </div>
        
        <div class="collections-grid">
          <div class="collection-card">
            <div class="icon-wrapper">🌱</div>
            <h3>Infantil</h3>
            <p>Alfabetização, sentimentos e natureza.</p>
          </div>
          <div class="collection-card">
            <div class="icon-wrapper">🌈</div>
            <h3>Juvenil</h3>
            <p>Fantasia, descobertas e desafios.</p>
          </div>
          <div class="collection-card">
            <div class="icon-wrapper">🧘‍♀️</div>
            <h3>Adulto</h3>
            <p>Bem-estar, arte e autocuidado.</p>
          </div>
        </div>

        <div class="final-text">
          <p>Com formatos interativos e downloads digitais, queremos estar ao seu lado em cada fase da vida — seja você um pai, educador, terapeuta ou simplesmente alguém buscando momentos de cor e leveza.</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
@use '@/assets/scss/variables' as *;

.about-us-page {
  padding: 4rem 0;
  background-color: #fdfdfd;
}

.container {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 1rem;
}

.hero-section {
  text-align: center;
  margin-bottom: 3rem;
  
  .page-title {
    font-size: 2.8rem;
    font-weight: 700;
    color: $dark;
    margin-bottom: 0.5rem;
  }
  
  .subtitle {
    font-size: 1.25rem;
    color: $gray-600;
    max-width: 600px;
    margin: 0 auto;
  }
}

.content-section {
  background-color: $white;
  padding: 3rem;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-md;
}

.text-content {
  font-size: 1.1rem;
  line-height: 1.7;
  color: $gray-700;
  margin-bottom: 3rem;
  text-align: center;
  
  p {
    margin-bottom: 1.5rem;
  }
}

.collections-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.collection-card {
  background-color: #f8f9fa;
  padding: 2rem;
  border-radius: $border-radius-md;
  text-align: center;
  border: 1px solid $light;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: $shadow-lg;
  }
  
  .icon-wrapper {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
  
  h3 {
    font-size: 1.5rem;
    color: $primary;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: $gray-600;
  }
}

.final-text {
  text-align: center;
  font-size: 1.1rem;
  color: $gray-700;
  line-height: 1.7;
}
</style> 