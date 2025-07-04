<template>
  <div class="toast-container">
    <transition-group name="toast-fade" tag="div">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="['toast-notification', `toast-${notification.type}`]"
      >
        <div class="toast-icon">
          <font-awesome-icon v-if="notification.type === 'success'" icon="check-circle" />
          <font-awesome-icon v-if="notification.type === 'error'" icon="exclamation-triangle" />
        </div>
        <div class="toast-message">
          {{ notification.message }}
        </div>
        <button class="toast-close" @click="removeNotification(notification.id)">
          <font-awesome-icon icon="times" />
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { useNotifications } from '@/composables/useNotifications';

const { notifications, removeNotification } = useNotifications();
</script>

<style lang="scss" scoped>
.toast-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.toast-notification {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  color: #fff;
  font-size: 1rem;
  min-width: 300px;
  transition: all 0.5s ease;
}

.toast-success {
  background-color: #4CAF50; /* Verde */
}

.toast-error {
  background-color: #f44336; /* Vermelho */
}

.toast-icon {
  margin-right: 1rem;
  font-size: 1.5rem;
}

.toast-message {
  flex-grow: 1;
}

.toast-close {
  background: none;
  border: none;
  color: #fff;
  font-size: 1rem;
  margin-left: 1.5rem;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 1;
  }
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.5s ease;
}

.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style> 