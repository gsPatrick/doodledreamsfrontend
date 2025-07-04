<template>
    <div class="not-found-page">
        <div class="container">
            <div class="not-found-content">
                <div class="not-found-image">
                    <img src="@/assets/images/404.svg" alt="Página não encontrada">
                </div>

                <h1>Página não encontrada</h1>
                <p>A página que você está procurando não existe ou foi removida.</p>

                <div class="not-found-actions">
                    <router-link to="/" class="btn btn-primary btn-lg">
                        <font-awesome-icon icon="home" />
                        Voltar para Home
                    </router-link>

                    <router-link to="/catalog" class="btn btn-outline btn-lg">
                        <font-awesome-icon icon="book" />
                        Explorar Catálogo
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'NotFound'
}
</script>

<style lang="scss">
.not-found-page {
    min-height: 80vh;
    @include flex(column, center, center);
    padding: $spacing-2xl 0;
}

.not-found-content {
    text-align: center;
    max-width: 600px;
    margin: 0 auto;

    .not-found-image {
        max-width: 400px;
        margin: 0 auto $spacing-xl;

        img {
            width: 100%;
            height: auto;
        }
    }

    h1 {
        font-size: $font-size-3xl;
        margin-bottom: $spacing-md;
    }

    p {
        font-size: $font-size-lg;
        color: $dark-30;
        margin-bottom: $spacing-xl;
    }
}

.not-found-actions {
    @include flex(row, center, center);
    gap: $spacing-md;

    @include respond-to('sm-down') {
        flex-direction: column;
    }
}
</style>