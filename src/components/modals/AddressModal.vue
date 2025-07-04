<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h4>{{ isEditing ? 'Editar Endereço' : 'Adicionar Novo Endereço' }}</h4>
        <button class="close-btn" @click="$emit('close')">&times;</button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="saveAddress">
          <div class="form-group">
            <label for="cep">CEP</label>
            <input
              type="text"
              v-model="form.cep"
              @blur="fetchCep"
              placeholder="00000-000"
              maxlength="9"
            />
            <small v-if="cepLoading">Buscando CEP...</small>
          </div>
          <!-- Restante do formulário -->
          <div class="form-group">
            <label for="rua">Rua</label>
            <input type="text" v-model="form.rua" placeholder="Nome da rua" />
          </div>
          <div class="form-group-inline">
            <div class="form-group">
              <label for="numero">Número</label>
              <input type="text" v-model="form.numero" placeholder="Ex: 123" />
            </div>
            <div class="form-group">
              <label for="complemento">Complemento</label>
              <input type="text" v-model="form.complemento" placeholder="Apto, bloco, etc." />
            </div>
          </div>
          <div class="form-group">
            <label for="bairro">Bairro</label>
            <input type="text" v-model="form.bairro" placeholder="Nome do bairro" />
          </div>
          <div class="form-group-inline">
            <div class="form-group">
              <label for="cidade">Cidade</label>
              <input type="text" v-model="form.cidade" placeholder="Nome da cidade" />
            </div>
            <div class="form-group">
              <label for="estado">Estado</label>
              <input type="text" v-model="form.estado" placeholder="UF" maxlength="2" />
            </div>
          </div>
          <div class="form-group">
            <label for="nome">Nome Completo</label>
            <input type="text" v-model="form.nome" placeholder="Ex: João da Silva" />
          </div>
          <div class="form-group">
            <label for="documento">CPF/CNPJ</label>
            <input
              type="text"
              v-model="form.documento"
              placeholder="000.000.000-00 ou 00.000.000/0001-00"
            />
          </div>
          <div class="form-group">
            <label for="telefone">Telefone</label>
            <input type="text" v-model="form.telefone" placeholder="(00) 00000-0000" />
          </div>
          <div class="form-check">
            <input type="checkbox" v-model="form.principal" id="principal" />
            <label for="principal">Tornar este o endereço principal</label>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="$emit('close')">
              Cancelar
            </button>
            <button type="submit" class="btn btn-primary" :disabled="isSaving">
              {{ isSaving ? 'Salvando...' : 'Salvar Endereço' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import addressService from '@/services/addressService'

export default {
  name: 'AddressModal',
  props: {
    address: { type: Object, default: null },
  },
  data() {
    return {
      form: {
        cep: '',
        nome: '',
        documento: '',
        telefone: '',
        rua: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
        principal: false,
      },
      cepLoading: false,
      isSaving: false,
    }
  },
  computed: {
    isEditing() {
      return this.address && this.address.id
    },
  },
  methods: {
    async fetchCep() {
      if (this.form.cep.length < 8) return
      this.cepLoading = true
      try {
        const data = await addressService.getCep(this.form.cep)
        if (!data.erro) {
          this.form.rua = data.logradouro
          this.form.bairro = data.bairro
          this.form.cidade = data.localidade
          this.form.estado = data.uf
        }
      } catch (error) {
        console.error('Erro ao buscar CEP', error)
      } finally {
        this.cepLoading = false
      }
    },
    async saveAddress() {
      this.isSaving = true
      try {
        if (this.isEditing) {
          await addressService.updateAddress(this.address.id, this.form)
        } else {
          await addressService.createAddress(this.form)
        }
        this.$emit('saved')
      } catch (error) {
        console.error('Erro ao salvar endereço', error)
        alert('Não foi possível salvar o endereço.')
      } finally {
        this.isSaving = false
      }
    },
  },
  created() {
    if (this.isEditing) {
      this.form = { ...this.address }
    }
  },
}
</script>

<style lang="scss" scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  @include flex(row, center, center);
  z-index: 1000;
}
.modal-content {
  background-color: $white;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-lg;
  width: 90%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  max-height: 90vh; /* Altura máxima de 90% da tela */
}
.modal-header,
.modal-footer,
.modal-body {
  padding: $spacing-lg;
}
.modal-body {
  overflow-y: auto; /* Adiciona scroll se o conteúdo for maior */
  flex-grow: 1;
}
.modal-header {
  @include flex(row, space-between, center);
  border-bottom: 1px solid $light;
  h4 {
    margin: 0;
  }
  flex-shrink: 0;
}
.form-group-inline {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $spacing-md;
}
.modal-footer {
  @include flex(row, flex-end, center);
  gap: $spacing-md;
  border-top: 1px solid $light;
  flex-shrink: 0;
}
</style>
