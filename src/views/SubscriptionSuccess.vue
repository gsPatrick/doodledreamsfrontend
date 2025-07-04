<template>
    <div class="status-page">
        <div class="status-card">
            <div class="status-icon success">
                <font-awesome-icon icon="check-circle" />
            </div>
            <h1>Assinatura Realizada com Sucesso!</h1>
            <p>Seu plano foi ativado. Você já pode aproveitar todos os benefícios.</p>
            <router-link to="/perfil" class="btn btn-primary">Ver Minha Assinatura</router-link>
            <router-link to="/" class="btn btn-secondary">Voltar para Home</router-link>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SubscriptionSuccess',
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
.success {
    color: #28a745;
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