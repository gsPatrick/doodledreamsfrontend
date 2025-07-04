import axios from 'axios'
import axiosRetry from 'axios-retry'
import router from '@/router'


// Configuração base do Axios
const api = axios.create({
  baseURL: 'https://n8n-doodledreambackend.r954jc.easypanel.host/',
  //baseURL: 'http://localhost:3045',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Política de retry exponencial para falhas de rede
axiosRetry(api, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: error => {
    return axiosRetry.isNetworkOrIdempotentRequestError(error) || error.response?.status === 429
  }
})

// Interceptor para adicionar o token de autenticação
api.interceptors.request.use(
  (config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para lidar com respostas de erro (especialmente 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Evita loop infinito em /login
      if (error.config.url !== '/api/auth/login') {
        // Remove token inválido/expirado
        localStorage.removeItem('token')

        // Verifica se a rota atual exige autenticação
        const requiresAuth = router.currentRoute.value?.meta?.requiresAuth;

        if (requiresAuth) {
          router.push({ name: 'Login' });
        }
        // Se não exigir, apenas prossegue sem redirecionar
      }
    }
    return Promise.reject(error)
  }
)

export default api