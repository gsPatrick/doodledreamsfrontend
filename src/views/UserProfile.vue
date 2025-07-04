<template>
  <div class="profile-page">
    <div class="container">
      <div class="breadcrumb">
        <router-link to="/" class="breadcrumb-item">Home</router-link>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-item active"> Minha Conta</span>
      </div>

      <div class="profile-container">
        <aside class="profile-sidebar" v-if="user">
          <div class="profile-info">
            <h2 class="profile-name">{{ user.nome }}</h2>
            <p class="profile-email">{{ user.email }}</p>
          </div>

          <nav class="profile-nav">
            <button
              class="nav-item"
              :class="{ active: activeTab === 'orders' }"
              @click="activeTab = 'orders'"
            >
              <font-awesome-icon icon="shopping-bag" />
              Meus Pedidos
            </button>
            <button
              class="nav-item"
              :class="{ active: activeTab === 'addresses' }"
              @click="activeTab = 'addresses'"
            >
              <font-awesome-icon icon="map-marker-alt" />
              Endereços
            </button>
            <button
              class="nav-item"
              :class="{ active: activeTab === 'subscription' }"
              @click="activeTab = 'subscription'"
            >
              <font-awesome-icon icon="rocket" />
              Assinatura
            </button>
            <button
              class="nav-item"
              :class="{ active: activeTab === 'downloads' }"
              @click="activeTab = 'downloads'"
            >
              <font-awesome-icon icon="download" />
              Meus Downloads
            </button>
            <button
              class="nav-item"
              :class="{ active: activeTab === 'security' }"
              @click="activeTab = 'security'"
            >
              <font-awesome-icon icon="lock" />
              Segurança
            </button>
          </nav>

          <button @click="logout" class="btn btn-outline btn-block logout-btn">
            <font-awesome-icon icon="sign-out-alt" />
            Sair
          </button>
        </aside>

        <main class="profile-content">
          <div v-if="!user" class="loading-state">
            <p>Verificando seus dados...</p>
            <!-- Pode adicionar um spinner aqui -->
          </div>
          <template v-else>
            <!-- Pedidos -->
            <section v-if="activeTab === 'orders'" class="tab-content">
              <h3 class="tab-title">Meus Pedidos</h3>
              <div v-if="loadingOrders">Carregando pedidos...</div>
              <div class="orders-list" v-else-if="orders.length">
                <div v-for="order in orders" :key="order.id" class="order-card">
                  <div class="order-header">
                    <div class="order-info">
                      <span class="order-number">Pedido #{{ order.id }}</span>
                      <span class="order-date">{{ formatDate(order.createdAt) }}</span>
                    </div>
                    <span class="order-status" :class="order.status">
                      {{ order.status }}
                    </span>
                  </div>

                  <div class="order-items">
                    <template v-if="order.itens && order.itens.length">
                      <router-link
                        v-for="item in order.itens"
                        :key="item.produtoId"
                        v-if="item && item.produto && item.produto.id"
                        :to="{ name: 'ProductDetail', params: { id: item.produto.id } }"
                        class="order-item"
                      >
                        <img
                          :src="item.produto.imagemUrl"
                          @error="setFallbackImage"
                          :alt="item.produto.nome"
                        />
                        <div class="item-info">
                          <h4>{{ item.produto.nome }}</h4>
                          <p>{{ item.quantidade }}x R$ {{ formatPrice(item.preco) }}</p>
                        </div>
                      </router-link>
                      <div 
                        v-else-if="item" 
                        class="order-item unavailable-product"
                      >
                        <img
                          src="https://placehold.co/80x80/E2E8F0/4A5568?text=Indisponível"
                          alt="Produto indisponível"
                        />
                        <div class="item-info">
                          <h4>Produto Indisponível</h4>
                          <p>{{ item.quantidade }}x R$ {{ formatPrice(item.preco) }}</p>
                        </div>
                      </div>
                    </template>
                    <div v-else class="order-items-empty">
                      <p>Nenhum item encontrado neste pedido</p>
                    </div>
                  </div>

                  <div class="order-footer">
                    <div class="order-total">
                      <span>Total</span>
                      <strong>R$ {{ formatPrice(order.total) }}</strong>
                    </div>
                    <router-link
                      :to="{ name: 'OrderDetail', params: { id: order.id } }"
                      class="btn btn-outline"
                    >
                      Ver Detalhes
                    </router-link>
                  </div>
                </div>
              </div>
              <div v-else class="empty-state">
                <img
                  src="https://placehold.co/200x200/E2E8F0/4A5568?text=:( "
                  alt="Nenhum pedido"
                />
                <h4>Nenhum pedido realizado</h4>
                <p>Você ainda não realizou nenhum pedido</p>
                <router-link to="/catalogo" class="btn btn-primary">
                  Explorar Catálogo
                </router-link>
              </div>
            </section>

            <!-- Endereços -->
            <section v-if="activeTab === 'addresses'" class="tab-content">
              <div class="tab-header">
                <h3 class="tab-title">Meus Endereços</h3>
                <button class="btn btn-primary" @click="openAddressModal()">
                  <font-awesome-icon icon="plus" /> Adicionar Novo
                </button>
              </div>
              <div v-if="loadingAddresses">Carregando endereços...</div>
              <div v-else-if="addresses.length" class="addresses-grid">
                <div v-for="address in addresses" :key="address.id" class="address-card">
                  <div class="address-header">
                    <div class="address-type" :class="{ principal: address.principal }">
                      {{ address.principal ? 'Principal' : 'Secundário' }}
                    </div>
                    <div class="address-actions">
                      <button class="btn-icon" @click="openAddressModal(address)">
                        <font-awesome-icon icon="pen" />
                      </button>
                      <button class="btn-icon danger" @click="confirmDeleteAddress(address.id)">
                        <font-awesome-icon icon="trash" />
                      </button>
                    </div>
                  </div>
                  <div class="address-content">
                    <p>{{ address.rua }}, {{ address.numero }}</p>
                    <p>{{ address.cidade }} - {{ address.estado }}</p>
                    <p>CEP: {{ address.cep }}</p>
                  </div>
                  <button
                    v-if="!address.principal"
                    class="btn btn-outline btn-sm"
                    @click="setPrincipal(address.id)"
                  >
                    Tornar Principal
                  </button>
                </div>
              </div>
              <div v-else class="empty-state">
                <h4>Nenhum endereço cadastrado.</h4>
                <p>Adicione um endereço para facilitar suas compras.</p>
              </div>
            </section>

            <!-- Assinatura -->
            <section v-if="activeTab === 'subscription'" class="tab-content">
              <h3 class="tab-title">Minha Assinatura</h3>
              <div v-if="loadingSubscription">Carregando dados da assinatura...</div>
              <div
                v-else-if="mySubscription && mySubscription.status === 'ativa'"
                class="subscription-details"
              >
                <div class="detail-item">
                  <strong>Plano:</strong>
                  <span>{{ mySubscription.plano.nome }}</span>
                </div>
                <div class="detail-item">
                  <strong>Status:</strong>
                  <span class="status-badge status-success">
                    {{ mySubscription.status }}
                  </span>
                </div>
                <div class="detail-item">
                  <strong>Próxima Cobrança:</strong>
                  <span>{{ formatDate(mySubscription.dataProximoCobranca) }}</span>
                </div>
                <button @click="confirmCancelSubscription" class="btn btn-danger">
                  Cancelar Assinatura
                </button>
              </div>
              <div v-else class="empty-state">
                <h4>Nenhuma assinatura ativa.</h4>
                <p>Explore nossos planos e junte-se ao clube!</p>
                <router-link to="/assinatura" class="btn btn-primary">Ver Planos</router-link>
              </div>
            </section>

            <!-- Downloads -->
            <section v-if="activeTab === 'downloads'" class="tab-content">
              <h3 class="tab-title">Meus Downloads</h3>
              <div v-if="loadingDownloads">Carregando seus produtos digitais...</div>
              <div v-else-if="downloads.length" class="downloads-list">
                <div v-for="item in downloads" :key="item.id" class="download-item">
                  <img
                    :src="
                      item.ArquivoProdutos && item.ArquivoProdutos[0]
                        ? item.ArquivoProdutos[0].url
                        : ''
                    "
                    @error="setFallbackImage"
                    :alt="item.nome"
                    class="download-item-image"
                  />
                  <div class="download-item-info">
                    <h4>{{ item.nome }}</h4>
                    <p>{{ item.descricao }}</p>
                  </div>
                  <a
                    :href="`/api/download/produto/${item.id}`"
                    target="_blank"
                    class="btn btn-primary"
                  >
                    <font-awesome-icon icon="download" /> Baixar
                  </a>
                </div>
              </div>
              <div v-else class="empty-state">
                <h4>Você não possui produtos digitais.</h4>
                <p>Explore nosso catálogo para encontrar e-books e outros conteúdos incríveis!</p>
                <router-link to="/catalogo" class="btn btn-primary">Explorar Catálogo</router-link>
              </div>
            </section>

            <!-- Segurança -->
            <section v-if="activeTab === 'security'" class="tab-content">
              <h3 class="tab-title">Segurança</h3>
              <form @submit.prevent="updatePassword" class="security-form">
                <div class="form-group">
                  <label for="currentPassword">Senha Atual</label>
                  <div class="password-input">
                    <input
                      :type="showCurrentPassword ? 'text' : 'password'"
                      id="currentPassword"
                      v-model="security.currentPassword"
                      class="form-control"
                    />
                    <button type="button" class="password-toggle" @click="toggleCurrentPassword">
                      <font-awesome-icon :icon="showCurrentPassword ? 'eye-slash' : 'eye'" />
                    </button>
                  </div>
                </div>

                <div class="form-group">
                  <label for="newPassword">Nova Senha</label>
                  <div class="password-input">
                    <input
                      :type="showNewPassword ? 'text' : 'password'"
                      id="newPassword"
                      v-model="security.newPassword"
                      class="form-control"
                    />
                    <button type="button" class="password-toggle" @click="toggleNewPassword">
                      <font-awesome-icon :icon="showNewPassword ? 'eye-slash' : 'eye'" />
                    </button>
                  </div>
                </div>

                <div class="form-group">
                  <label for="confirmNewPassword">Confirmar Nova Senha</label>
                  <div class="password-input">
                    <input
                      :type="showConfirmNewPassword ? 'text' : 'password'"
                      id="confirmNewPassword"
                      v-model="security.confirmNewPassword"
                      class="form-control"
                    />
                    <button type="button" class="password-toggle" @click="toggleConfirmNewPassword">
                      <font-awesome-icon :icon="showConfirmNewPassword ? 'eye-slash' : 'eye'" />
                    </button>
                  </div>
                </div>

                <button type="submit" class="btn btn-primary">Alterar Senha</button>
              </form>

              <div class="security-options">
                <h4>Opções de Segurança</h4>
                <div class="option-card">
                  <div class="option-content">
                    <h5>Autenticação em Duas Etapas</h5>
                    <p>Adicione uma camada extra de segurança à sua conta</p>
                  </div>
                  <label class="switch">
                    <input type="checkbox" v-model="security.twoFactor" />
                    <span class="slider"></span>
                  </label>
                </div>

                <div class="option-card">
                  <div class="option-content">
                    <h5>Notificações de Login</h5>
                    <p>Receba alertas quando sua conta for acessada em um novo dispositivo</p>
                  </div>
                  <label class="switch">
                    <input type="checkbox" v-model="security.loginAlerts" />
                    <span class="slider"></span>
                  </label>
                </div>
              </div>
            </section>
          </template>
        </main>
      </div>

      <!-- Modal de Endereço -->
      <AddressModal
        v-if="isAddressModalOpen"
        :address="selectedAddress"
        @close="closeAddressModal"
        @saved="handleAddressSaved"
      />
      <!-- Modal de Confirmação de Exclusão -->
      <ConfirmationModal
        v-if="showDeleteConfirm"
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir este endereço? Esta ação não pode ser desfeita."
        @confirm="deleteAddress"
        @cancel="cancelDelete"
      />
    </div>
  </div>
</template>

<script>
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'
import orderService from '@/services/orderService'
import addressService from '@/services/addressService'
import authService from '@/services/authService'
import subscriptionService from '@/services/subscriptionService'
import AddressModal from '@/components/modals/AddressModal.vue'
import ConfirmationModal from '@/components/modals/ConfirmationModal.vue'

export default {
  name: 'UserProfile',
  components: { AddressModal, ConfirmationModal },
  setup() {
    const { user, checkAuthStatus, logout: authLogout } = useAuth()
    const router = useRouter()

    const logout = () => {
      authLogout()
      router.push('/')
    }

    return { user, checkAuthStatus, logout }
  },
  data() {
    return {
      activeTab: 'orders',
      orders: [],
      addresses: [],
      mySubscription: null,
      downloads: [],
      loadingOrders: false,
      loadingAddresses: false,
      loadingSubscription: false,
      loadingDownloads: false,
      isAddressModalOpen: false,
      selectedAddress: null,
      showDeleteConfirm: false,
      addressToDeleteId: null,
      security: {
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
        twoFactor: false,
        loginAlerts: true,
      },
      showCurrentPassword: false,
      showNewPassword: false,
      showConfirmNewPassword: false,
      totalPages: 1,
      currentPage: 1,
    }
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return ''
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      return new Date(dateString).toLocaleDateString('pt-BR', options)
    },
    formatPrice(value) {
      const num = parseFloat(value) || 0
      return num.toFixed(2).replace('.', ',')
    },
    setFallbackImage(event) {
      event.target.src = 'https://placehold.co/80x80/E2E8F0/4A5568?text=Img'
    },
    async fetchOrders() {
      this.loadingOrders = true
      try {
        const response = await orderService.listMyOrders()
        this.orders = (response.pedidos || []).map(pedido => ({
          ...pedido,
          itens: Array.isArray(pedido.itens) ? pedido.itens : []
        }))
        this.totalPages = response.totalPages || 1
        this.currentPage = response.currentPage || 1
      } catch (error) {
        console.error('Erro ao buscar pedidos:', error)
        this.orders = []
      } finally {
        this.loadingOrders = false
      }
    },
    async fetchAddresses() {
      this.loadingAddresses = true
      try {
        const response = await addressService.getAddresses()
        this.addresses = response.data || []
      } catch (error) {
        console.error('Erro ao buscar endereços:', error)
      } finally {
        this.loadingAddresses = false
      }
    },
    async fetchMySubscription() {
      this.loadingSubscription = true
      try {
        const response = await subscriptionService.getMySubscription()
        this.mySubscription = response.data
      } catch (error) {
        console.error('Erro ao buscar assinatura:', error)
        this.mySubscription = null
      } finally {
        this.loadingSubscription = false
      }
    },
    async fetchDownloads() {
      this.loadingDownloads = true
      try {
        const response = await orderService.getMyDownloads()
        this.downloads = response.data || []
      } catch (error) {
        console.error('Erro ao buscar downloads:', error)
      } finally {
        this.loadingDownloads = false
      }
    },
    async updatePassword() {
      if (this.security.newPassword !== this.security.confirmNewPassword) {
        alert('A nova senha e a confirmação não correspondem.')
        return
      }
      try {
        await authService.changePassword(this.security.currentPassword, this.security.newPassword)
        alert('Senha alterada com sucesso!')
        this.security = {
          ...this.security,
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: '',
        }
      } catch (error) {
        alert('Erro ao alterar senha: ' + (error.response?.data?.erro || error.message))
      }
    },
    toggleCurrentPassword() {
      this.showCurrentPassword = !this.showCurrentPassword
    },
    toggleNewPassword() {
      this.showNewPassword = !this.showNewPassword
    },
    toggleConfirmNewPassword() {
      this.showConfirmNewPassword = !this.showConfirmNewPassword
    },
    openAddressModal(address = null) {
      this.selectedAddress = address ? { ...address } : null
      this.isAddressModalOpen = true
    },
    closeAddressModal() {
      this.isAddressModalOpen = false
      this.selectedAddress = null
    },
    handleAddressSaved() {
      this.fetchAddresses()
      this.closeAddressModal()
    },
    confirmDeleteAddress(id) {
      this.addressToDeleteId = id
      this.showDeleteConfirm = true
    },
    cancelDelete() {
      this.addressToDeleteId = null
      this.showDeleteConfirm = false
    },
    async deleteAddress() {
      if (!this.addressToDeleteId) return
      try {
        await addressService.deleteAddress(this.addressToDeleteId)
        this.fetchAddresses()
      } catch (error) {
        console.error('Erro ao excluir endereço', error)
        alert('Não foi possível excluir o endereço.')
      } finally {
        this.cancelDelete()
      }
    },
    async setPrincipal(id) {
      try {
        await addressService.setPrincipal(id)
        this.fetchAddresses()
      } catch (error) {
        alert('Erro ao definir endereço como principal.')
      }
    },
    async confirmCancelSubscription() {
      if (confirm('Tem certeza que deseja cancelar sua assinatura?')) {
        try {
          await subscriptionService.cancelSubscription()
          alert('Assinatura cancelada com sucesso!')
          await this.fetchMySubscription()
        } catch (error) {
          alert('Erro ao cancelar assinatura: ' + (error.response?.data?.erro || error.message))
        }
      }
    },
    loadTabData(tab) {
      if (tab === 'orders') this.fetchOrders()
      if (tab === 'addresses') this.fetchAddresses()
      if (tab === 'subscription') this.fetchMySubscription()
      if (tab === 'downloads') this.fetchDownloads()
    },
  },
  watch: {
    activeTab(newTab) {
      this.loadTabData(newTab)
    },
  },
  async created() {
    await this.checkAuthStatus()
    if (this.user) {
      this.loadTabData(this.activeTab)
    } else {
      this.$router.push('/login')
    }
  },
}
</script>
<style lang="scss" scoped>
@use '@/assets/scss/variables' as *;
@use '@/assets/scss/mixins' as *;
@use 'sass:color';

.profile-page {
  padding: $spacing-xl 0;
}

.profile-container {
  @include flex(row, flex-start, stretch);
  gap: $spacing-xl;
  margin-top: $spacing-xl;
  background-color: $white;
}

.profile-sidebar {
  width: 280px;
  flex-shrink: 0;
  background-color: #ffffff;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-sm;
  padding: $spacing-lg;
}

.profile-info {
  text-align: center;
  padding-bottom: $spacing-lg;
  border-bottom: 1px solid $light;
  margin-bottom: $spacing-lg;
  color: $dark;
}

.profile-name {
  font-size: $font-size-lg;
  color: #2d3748;
  margin-bottom: $spacing-xs;
}

.profile-email {
  font-size: $font-size-sm;
  color: color.adjust(#2d3748, $lightness: 30%);
}

.profile-nav {
  @include flex(column, flex-start, stretch);
  gap: $spacing-xs;
  margin-bottom: $spacing-xl;
  color: $dark;

  .nav-item {
    @include flex(row, flex-start, center);
    gap: $spacing-sm;
    padding: $spacing-sm;
    border: none;
    background: none;
    color: #2d3748;
    font-size: $font-size-md;
    cursor: pointer;
    border-radius: $border-radius-sm;
    transition: all 0.3s ease;

    &:hover {
      background-color: $light;
      color: #2d3748;
    }

    &.active {
      background-color: $primary;
      color: #ffffff;
    }

    svg {
      width: 18px;
    }
  }
}

.logout-btn {
  @include flex(row, center, center);
  gap: $spacing-sm;
  color: $danger;
  border-color: $danger;

  &:hover {
    background-color: $danger;
    color: #ffffff;
  }
}

.profile-content {
  flex: 1;
  background-color: $white;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-sm;
  padding: $spacing-xl;
}

.tab-title {
  font-size: $font-size-2xl;
  color: $dark;
  margin-bottom: $spacing-xl;
}

.orders-list {
  @include flex(column, flex-start, stretch);
  gap: $spacing-lg;
}

.order-card {
  border: 1px solid $light;
  border-radius: $border-radius-lg;
  overflow: hidden;
}

.order-header {
  @include flex(row, space-between, center);
  padding: $spacing-md;
  background-color: $light;

  .order-info {
    @include flex(column, flex-start, flex-start);
    gap: $spacing-xs;

    .order-number {
      font-weight: 500;
      color: #2d3748;
    }

    .order-date {
      font-size: $font-size-sm;
      color: color.adjust(#2d3748, $lightness: 30%);
    }
  }

  .order-status {
    padding: $spacing-xs $spacing-sm;
    border-radius: $border-radius-sm;
    font-size: $font-size-sm;
    font-weight: 500;

    &.delivered {
      background-color: color.adjust($success, $lightness: 45%);
      color: $success;
    }

    &.processing {
      background-color: color.adjust($warning, $lightness: 45%);
      color: $warning;
    }

    &.cancelled {
      background-color: color.adjust($danger, $lightness: 45%);
      color: $danger;
    }
  }
}

.order-items {
  padding: $spacing-md;
  border-bottom: 1px solid $light;

  .order-item {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    padding: $spacing-md;
    border-bottom: 1px solid $light;
    text-decoration: none;
    color: inherit;

    &:last-child {
      border-bottom: none;
    }

    img {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: $border-radius-sm;
    }
  }
}

.unavailable-product {
  opacity: 0.7;
  background-color: #f8f9fa;
  border-radius: $border-radius-sm;
}

.order-footer {
  @include flex(row, space-between, center);
  padding: $spacing-md;

  .order-total {
    @include flex(row, flex-start, center);
    gap: $spacing-sm;

    span {
      color: color.adjust(#2d3748, $lightness: 30%);
    }

    strong {
      font-size: $font-size-lg;
      color: #2d3748;
    }
  }
}

.empty-state {
  text-align: center;
  padding: $spacing-2xl;

  img {
    width: 200px;
    height: 200px;
    margin-bottom: $spacing-lg;
  }

  h4 {
    font-size: $font-size-xl;
    color: #2d3748;
    margin-bottom: $spacing-sm;
  }

  p {
    color: color.adjust(#2d3748, $lightness: 30%);
    margin-bottom: $spacing-lg;
  }
}

.security-form {
  max-width: 400px;
  margin-bottom: $spacing-2xl;

  .form-group {
    margin-bottom: $spacing-lg;
  }
}

.security-options {
  h4 {
    font-size: $font-size-lg;
    color: #2d3748;
    margin-bottom: $spacing-lg;
  }
}

.option-card {
  @include flex(row, space-between, center);
  padding: $spacing-md;
  background-color: $light;
  border-radius: $border-radius-lg;
  margin-bottom: $spacing-md;

  .option-content {
    h5 {
      font-size: $font-size-md;
      color: #2d3748;
      margin-bottom: $spacing-xs;
    }

    p {
      font-size: $font-size-sm;
      color: color.adjust(#2d3748, $lightness: 30%);
    }
  }
}

.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 26px;

  input {
    opacity: 0;
    width: 0;
    height: 0;

    &:checked + .slider {
      background-color: $primary;

      &:before {
      }
    }
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: color.adjust(#2d3748, $lightness: 60%);
    transition: 0.4s;
    border-radius: 34px;

    &:before {
      position: absolute;
      content: '';
      height: 18px;
      width: 18px;
      left: 4px;
      bottom: 4px;
      background-color: #ffffff;
      transition: 0.4s;
      border-radius: 50%;
    }
  }
}

.tab-header {
  @include flex(row, space-between, center);
  margin-bottom: $spacing-lg;
}
.addresses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: $spacing-lg;
}
.address-card {
  cursor: pointer;
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: $border-radius-md;
  padding: $spacing-md;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition:
    box-shadow 0.2s,
    transform 0.2s;

  &:hover {
    box-shadow: $shadow-md;
  }
}

.address-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: $spacing-md;
}

.address-type {
  font-size: $font-size-sm;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: $border-radius-full;
  background-color: #e9ecef;
  color: #495057;

  &.principal {
    background-color: color.adjust($primary, $lightness: 30%);
    color: color.adjust($primary, $lightness: -10%);
  }
}

.address-actions {
  display: flex;
  gap: $spacing-sm;

  .btn-icon {
    background: none;
    border: none;
    cursor: pointer;
    color: #6c757d;
    font-size: 1rem;
    padding: 0.25rem;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: inline-flex;
    justify-content: center;
    align-items: center;

    &:hover {
      background-color: #e9ecef;
      color: #212529;
    }

    &.danger:hover {
      background-color: color.adjust($danger, $lightness: 30%);
      color: $danger;
    }
  }
}

.address-content {
  margin-bottom: $spacing-md;
  flex-grow: 1;

  p {
    margin: 0 0 $spacing-xs 0;
    color: #495057;
    line-height: 1.5;
  }
}

.subscription-details {
  padding: $spacing-md;
  border: 1px solid $light;
  border-radius: $border-radius-lg;
  margin-bottom: $spacing-lg;

  .detail-item {
    margin-bottom: $spacing-md;

    strong {
      font-weight: 600;
      color: #2d3748;
    }

    span {
      color: color.adjust(#2d3748, $lightness: 30%);
    }
  }

  .status-badge {
    padding: 0.25rem 0.75rem;
    border-radius: $border-radius-full;
    background-color: #e9ecef;
    color: #495057;

    &.status-success {
      background-color: color.adjust($success, $lightness: 45%);
    }

    &.status-warning {
      background-color: color.adjust($warning, $lightness: 45%);
    }

    &.status-danger {
      background-color: color.adjust($danger, $lightness: 45%);
    }
  }

  .btn {
    margin-top: $spacing-lg;
  }
}

.downloads-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.download-item {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-md;
  border: 1px solid $light;
  border-radius: $border-radius-md;
}

.download-item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: $border-radius-sm;
  flex-shrink: 0;
}

.download-item-info {
  flex-grow: 1;
  h4 {
    margin-bottom: $spacing-xs;
  }
  p {
    font-size: $font-size-sm;
    color: color.adjust(#2d3748, $lightness: 30%);
  }
}

.section-title {
  color: color.adjust(#2d3748, $lightness: 30%);
}

.status-success {
  background-color: color.adjust($success, $lightness: 45%);
}

.status-warning {
  background-color: color.adjust($warning, $lightness: 45%);
}

.status-danger {
  background-color: color.adjust($danger, $lightness: 45%);
}

.subscription-active {
  background-color: color.adjust($primary, $lightness: 30%);
  
  .subscription-status {
    color: color.adjust($primary, $lightness: -10%);
  }
}

.subscription-inactive {
  background-color: color.adjust($danger, $lightness: 30%);
}
</style>
