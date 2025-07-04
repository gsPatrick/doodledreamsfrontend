<template>
    <div class="status-page">
        <div class="status-card">
            <div class="status-icon error">
                <font-awesome-icon icon="times-circle" />
            </div>
            <h1>Ocorreu um Erro</h1>
            <p>Não foi possível processar sua assinatura. Por favor, tente novamente.</p>
            <p>Se o problema persistir, entre em contato com o suporte.</p>
            <router-link to="/assinatura" class="btn btn-primary">Tentar Novamente</router-link>
            <router-link to="/" class="btn btn-secondary">Voltar para Home</router-link>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SubscriptionError',
};
</script>

<style scoped>
.status-page {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80vh;
    text-align: center;
}
.status-card {
    padding: 40px;
    border-radius: 8px;
    background-color: #fff;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
.status-icon {
    font-size: 5rem;
    margin-bottom: 20px;
}
.error {
    color: #dc3545;
}
h1 {
    margin-bottom: 15px;
}
p {
    margin-bottom: 30px;
    color: #6c757d;
}
.btn {
    margin: 0 10px;
}
</style> 