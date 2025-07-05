import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { useAuth } from './composables/useAuth'; // <-- Importação do useAuth

// Importar FontAwesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faShoppingCart, faUser, faSearch, faHeart, faStar, faStarHalf,
  faChevronLeft, faChevronRight, faArrowRight, faCheck, faTimes,
  faFilter, faSort, faSpinner, faExclamationCircle, faInfoCircle,
  faChild, faBookReader, faClock, faQrcode, faCreditCard,
  faBarcode, faEnvelope, faPhone, faMapMarkerAlt, faLock, faEye,
  faEyeSlash, faPlus, faMinus, faTrash, faEdit, faSignOutAlt,
  faChevronDown, faCamera, faShoppingBag, faThLarge, faList,
  faArrowLeft, faBookOpen, faMobileAlt, faSync, faHeadphones,
  faHome, faBook, faStarHalfAlt, faUserCircle, faRocket, faDownload,
  faPen, faPlayCircle, faExclamationTriangle, faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import {
  faFacebook, faInstagram, faTwitter, faYoutube, faPinterest,
  faGoogle, faTiktok
} from '@fortawesome/free-brands-svg-icons';
import { faStar as farStar, faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';

// Importar estilos SCSS
import './assets/scss/main.scss';

// Adicionar ícones à biblioteca
library.add(
  faShoppingCart, faUser, faSearch, faHeart, faStar, faStarHalf,
  faChevronLeft, faChevronRight, faArrowRight, faCheck, faTimes,
  faFilter, faSort, faSpinner, faExclamationCircle, faInfoCircle,
  faChild, faBookReader, faBook, faClock, faQrcode, faCreditCard,
  faBarcode, faEnvelope, faPhone, faMapMarkerAlt, faLock, faEye,
  faEyeSlash, faPlus, faMinus, faTrash, faEdit, faSignOutAlt,
  faFacebook, faInstagram, faTwitter, faYoutube, faPinterest,
  faChevronDown, faCamera, faShoppingBag, faThLarge, faList, faGoogle,
  faArrowLeft, faBookOpen, faMobileAlt, faSync, faHeadphones,
  faHome, faStarHalfAlt, farStar, faUserCircle, faTiktok, faRocket,
  faDownload, faPen, faPlayCircle, farHeart, faExclamationTriangle, faCheckCircle
);

// --- FUNÇÃO DE INICIALIZAÇÃO ASSÍNCRONA ---
async function initializeApp() {
  const app = createApp(App);

  // Registrar componentes globais
  app.component('font-awesome-icon', FontAwesomeIcon);

  // Usar plugins
  app.use(router);

  // --- MUDANÇA CRÍTICA ---
  // Espera a verificação de autenticação terminar ANTES de montar a aplicação.
  // Isso garante que quando qualquer componente for montado, o estado de login
  // (isLoggedIn, isAuthInitialized) já estará definido e correto.
  const { checkAuthStatus } = useAuth();
  await checkAuthStatus();

  // Montar a aplicação SOMENTE DEPOIS da verificação
  app.mount('#app');
}

// Chama a função de inicialização para iniciar a aplicação
initializeApp();