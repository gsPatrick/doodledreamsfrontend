import { ref, readonly } from 'vue';

const notifications = ref([]);

let notificationId = 0;

const addNotification = (notification) => {
  const id = notificationId++;
  notifications.value.push({ ...notification, id });

  if (notification.timeout !== 0) { // Permitir timeout 0 para notificações persistentes
    setTimeout(() => {
      removeNotification(id);
    }, notification.timeout || 5000);
  }
};

const removeNotification = (id) => {
  notifications.value = notifications.value.filter(n => n.id !== id);
};

export function useNotifications() {
  return {
    notifications: readonly(notifications),
    addNotification,
    removeNotification,
  };
} 