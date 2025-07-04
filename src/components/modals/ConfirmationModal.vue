<template>
  <div class="modal-backdrop" @click.self="cancel">
    <div class="modal-content">
      <div class="modal-header">
        <h4>{{ title }}</h4>
        <button class="close-btn" @click="cancel">&times;</button>
      </div>
      <div class="modal-body">
        <p>{{ message }}</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" @click="cancel">
          {{ cancelButtonText }}
        </button>
        <button type="button" class="btn btn-danger" @click="confirm">
          {{ confirmButtonText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConfirmationModal',
  props: {
    title: {
      type: String,
      default: 'Confirmar Ação',
    },
    message: {
      type: String,
      required: true,
    },
    confirmButtonText: {
      type: String,
      default: 'Confirmar',
    },
    cancelButtonText: {
      type: String,
      default: 'Cancelar',
    },
  },
  methods: {
    confirm() {
      this.$emit('confirm')
    },
    cancel() {
      this.$emit('cancel')
    },
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
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.modal-content {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  width: 90%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
}

.modal-header,
.modal-body,
.modal-footer {
  padding: 1.5rem;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #dee2e6;
  h4 {
    margin: 0;
    font-size: 1.25rem;
  }
}

.modal-body {
  p {
    margin: 0;
  }
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  border-top: 1px solid #dee2e6;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

/* Você pode usar as classes de botão globais ou definir aqui */
.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  border: 1px solid transparent;
  cursor: pointer;
  font-weight: 500;
}
.btn-secondary {
  background-color: #6c757d;
  color: white;
  &:hover {
    background-color: #5a6268;
  }
}
.btn-danger {
  background-color: #dc3545;
  color: white;
  &:hover {
    background-color: #c82333;
  }
}
</style>
