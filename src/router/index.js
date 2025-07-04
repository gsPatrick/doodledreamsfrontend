import { createRouter, createWebHistory } from 'vue-router'


// Importação das views (lazy loading)
const Home = () => import('@/views/Home.vue')
const Catalog = () => import('@/views/Catalog.vue')
const ProductDetail = () => import('@/views/ProductDetail.vue')
const Cart = () => import('@/views/Cart.vue')
const Checkout = () => import('@/views/Checkout.vue')
const Subscription = () => import('../views/Subscription.vue')
const SubscriptionCheckout = () => import('../views/SubscriptionCheckout.vue')
const Login = () => import('@/views/Login.vue')
const Register = () => import('@/views/Register.vue')
const UserProfile = () => import('@/views/UserProfile.vue')
const NotFound = () => import('@/views/NotFound.vue')
const OrderSuccess = () => import('@/views/OrderSuccess.vue')
const OrderDetail = () => import('@/views/OrderDetail.vue')
const Favorites = () => import('../views/Favorites.vue')
const SubscriptionSuccess = () => import('../views/SubscriptionSuccess.vue')
const SubscriptionError = () => import('../views/SubscriptionError.vue')
const SubscriptionPending = () => import('../views/SubscriptionPending.vue')

// Páginas institucionais
const AboutView = () => import('@/views/AboutView.vue');
const TermsOfUseView = () => import('@/views/TermsOfUseView.vue');
const PrivacyPolicyView = () => import('@/views/PrivacyPolicyView.vue');

// Importar componentes
import ProdutosList from '../components/ProdutosList.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: 'Doodle Dreams - Livros Ilustrados e Educativos' }
  },
  {
    path: '/catalogo',
    name: 'Catalog',
    component: Catalog,
    meta: { title: 'Catálogo - Doodle Dreams' }
  },
  {
    path: '/catalogo/:category',
    name: 'CatalogCategory',
    component: Catalog,
    meta: { title: 'Catálogo por Categoria - Doodle Dreams' }
  },
  {
    path: '/produto/:id',
    name: 'ProductDetail',
    component: ProductDetail,
    meta: { title: 'Detalhes do Produto - Doodle Dreams' }
  },
  {
    path: '/carrinho',
    name: 'Cart',
    component: Cart,
    meta: { title: 'Carrinho de Compras - Doodle Dreams' }
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: Checkout,
    meta: { title: 'Finalizar Compra - Doodle Dreams' }
  },
  {
    path: '/assinatura',
    name: 'Subscription',
    component: Subscription,
    meta: { title: 'Planos de Assinatura - Doodle Dreams' }
  },
  {
    path: '/assinatura/checkout/:planoId',
    name: 'SubscriptionCheckout',
    component: SubscriptionCheckout,
    meta: { title: 'Finalizar Assinatura - Doodle Dreams', requiresAuth: true }
  },
  {
    path: '/assinatura/sucesso',
    name: 'SubscriptionSuccess',
    component: SubscriptionSuccess,
    meta: { title: 'Assinatura Realizada - Doodle Dreams', requiresAuth: true }
  },
  {
    path: '/assinatura/erro',
    name: 'SubscriptionError',
    component: SubscriptionError,
    meta: { title: 'Erro na Assinatura - Doodle Dreams', requiresAuth: true }
  },
  {
    path: '/assinatura/pendente',
    name: 'SubscriptionPending',
    component: SubscriptionPending,
    meta: { title: 'Assinatura Pendente - Doodle Dreams', requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { title: 'Login - Doodle Dreams', guest: true }
  },
  {
    path: '/cadastro',
    name: 'Register',
    component: Register,
    meta: { title: 'Cadastro - Doodle Dreams', guest: true }
  },
  {
    path: '/perfil',
    name: 'UserProfile',
    component: UserProfile,
    meta: { title: 'Meu Perfil - Doodle Dreams', requiresAuth: true }
  },
  {
    path: '/favoritos',
    name: 'Favorites',
    component: Favorites,
    meta: { title: 'Favoritos - Doodle Dreams', requiresAuth: true }
  },
  {
    path: '/pedido-realizado',
    name: 'OrderSuccess',
    component: OrderSuccess,
    meta: { title: 'Pedido Realizado - Doodle Dreams', requiresAuth: true }
  },
  {
    path: '/meus-pedidos/:id',
    name: 'OrderDetail',
    component: OrderDetail,
    meta: { title: 'Detalhes do Pedido - Doodle Dreams', requiresAuth: true }
  },
  {
    path: '/produtos',
    name: 'Produtos',
    component: ProdutosList,
    meta: { title: 'Produtos - Doodle Dreams', requiresAuth: true }
  },
  {
    path: '/sobre',
    name: 'About',
    component: AboutView,
    meta: { title: 'Sobre Nós - Doodle Dreams' }
  },
  {
    path: '/termos-de-uso',
    name: 'TermsOfUse',
    component: TermsOfUseView,
    meta: { title: 'Termos de Uso - Doodle Dreams' }
  },
  {
    path: '/politica-de-privacidade',
    name: 'PrivacyPolicy',
    component: PrivacyPolicyView,
    meta: { title: 'Política de Privacidade - Doodle Dreams' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: { title: 'Página não encontrada - Doodle Dreams' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Middleware de autenticação
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isAuthPage = to.matched.some(record => record.meta.isAuthPage)

  if (requiresAuth && !token) {
    // Se a rota requer autenticação e não há token, redireciona para o login
    // com o parâmetro redirect para voltar para a página atual após o login
    next({
      path: '/login',
      query: { 
        redirect: to.fullPath,
        ghost: 'true' // Indica que o usuário pode usar o cadastro ghost
      }
    })
  } else if (isAuthPage && token) {
    // Se já está autenticado e tenta acessar página de auth, redireciona para home
    next({ path: '/' })
  } else {
    next()
  }
})

export default router

