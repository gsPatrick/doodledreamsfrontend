<template>
  <transition name="notification-fade">
    <div 
      v-if="notification" 
      class="notification" 
      :class="notificationClass"
    >
      <div class="notification-icon">
        <font-awesome-icon :icon="notificationIcon" />
      </div>
      <div class="notification-content">
        {{ notification.message }}
      </div>
      <button class="notification-close" @click="clearNotification">
        <font-awesome-icon icon="times" />
      </button>
    </div>
  </transition>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'Notification',
  computed: {
    ...mapGetters(['notification']),
    
    notificationClass() {
      if (!this.notification) return ''
      return `notification-${this.notification.type}`
    },
    
    notificationIcon() {
      if (!this.notification) return ''
      
      const icons = {
        success: 'check',
        error: 'exclamation-circle',
        warning: 'exclamation-circle',
        info: 'info-circle'
      }
      
      return icons[this.notification.type] || 'info-circle'
    }
  },
  methods: {
    ...mapMutations(['CLEAR_NOTIFICATION']),
    
    clearNotification() {
      this.CLEAR_NOTIFICATION()
    }
  }
}
</script>

<style>
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-lg);
  min-width: 300px;
  max-width: 400px;
  
  @include respond-to(sm-down) {
    top: 10px;
    right: 10px;
    left: 10px;
    min-width: auto;
    max-width: none;
  }
  
  &-success {
    background-color: rgba(var(--accent), 0.95);
    color: var(--white);
  }
  
  &-error {
    background-color: rgba(var(--danger), 0.95);
    color: var(--white);
  }
  
  &-warning {
    background-color: rgba(var(--warning), 0.95);
    color: var(--dark);
  }
  
  &-info {
    background-color: rgba(var(--info), 0.95);
    color: var(--white);
  }
  
  &-icon {
    margin-right: var(--spacing-md);
    font-size: var(--font-size-lg);
  }
  
  &-content {
    flex-grow: 1;
    font-size: var(--font-size-sm);
  }
  
  &-close {
    margin-left: var(--spacing-md);
    color: currentColor;
    opacity: 0.7;
    transition: var(--transition-base);
    
    &:hover {
      opacity: 1;
    }
  }
}

.notification-fade-enter-active,
.notification-fade-leave-active {
  transition: all 0.3s ease;
}

.notification-fade-enter-from,
.notification-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>

