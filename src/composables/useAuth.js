import { ref, computed } from 'vue';
import api from '@/services/api';
import authService from '@/services/authService';

// Estado reativo GLOBAL, definido fora da função principal.
const user = ref(null);
const token = ref(localStorage.getItem('token'));
const isLoggedIn = computed(() => !!user.value);
let authInitialized = false; // Flag para garantir que a verificação seja feita apenas uma vez.

// Função para verificar o status de autenticação (pode ser chamada de fora)
const checkAuthStatus = async () => {
    if (!token.value) {
        user.value = null;
        return;
    }
    try {
        // Essa rota é protegida e retorna os dados do usuário se o token for válido
        const response = await api.get('/api/usuarios/perfil');
        user.value = response.data;
    } catch (error) {
        // O interceptor de API já vai lidar com o erro 401, redirecionando para o login.
        // Aqui limpamos o estado local para garantir consistência.
        console.error("Falha ao verificar status de autenticação:", error);
        user.value = null;
        token.value = null; // Garante que a variável reativa local seja limpa
        localStorage.removeItem('token');
    }
};

// O hook principal
export function useAuth() {
    // Garante que a verificação inicial seja feita apenas uma vez na vida útil da aplicação
    if (!authInitialized) {
        checkAuthStatus();
        authInitialized = true;
    }

    const login = async (credentials) => {
        // A função de login no authService já retorna o usuário e o token
        const { token: newToken, usuario } = await authService.login(credentials.email, credentials.senha);
        
        localStorage.setItem('token', newToken);
        token.value = newToken;
        user.value = usuario;
    };

    const logout = () => {
        localStorage.removeItem('token');
        token.value = null;
        user.value = null;
        window.location.href = '/login'; // Força o redirecionamento e limpeza de estado
    };
    
    // Método para definir o usuário no estado após criar a conta ghost
    const setUser = (userData) => {
        user.value = userData;
    };

    return {
        user,
        isLoggedIn,
        login,
        logout,
        checkAuthStatus,
        setUser
    };
} 