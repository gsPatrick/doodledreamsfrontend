import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Importar FontAwesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
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
} from '@fortawesome/free-solid-svg-icons'
import {
  faFacebook, faInstagram, faTwitter, faYoutube, faPinterest,
  faGoogle, faTiktok
} from '@fortawesome/free-brands-svg-icons'
import { faStar as farStar, faHeart as farHeart } from '@fortawesome/free-regular-svg-icons'

// Importar estilos SCSS
import './assets/scss/main.scss'
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
)

// Criar e montar a aplicação
const app = createApp(App)

// Registrar componentes globais
app.component('font-awesome-icon', FontAwesomeIcon)

// Usar plugins
app.use(router)

// Montar a aplicação
app.mount('#app')

