<template>
    <div class="status-page">
        <div class="status-card">
            <div class="status-icon pending">
                <font-awesome-icon icon="clock" />
            </div>
            <h1>Pagamento Pendente</h1>
            <p>Sua assinatura está quase pronta! Estamos aguardando a confirmação do pagamento.</p>
            <p>Você será notificado assim que o processo for concluído.</p>
            <router-link to="/perfil" class="btn btn-primary">Acompanhar Status</router-link>
            <router-link to="/" class="btn btn-secondary">Voltar para Home</router-link>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SubscriptionPending',
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
.pending {
    color: #ffc107;
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