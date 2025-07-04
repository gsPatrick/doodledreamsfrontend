import api from './api';

const subscriptionService = {
  getPlans: () => {
    return api.get('/api/subscriptions/planos');
  },
  getPlanDetails: (planoId) => {
    return api.get(`/api/subscriptions/planos/${planoId}`);
  },
  calculateShipping: (data) => {
    return api.post('/api/subscriptions/calculate-shipping', data);
  },
  subscribe: (data) => {
    return api.post('/api/subscriptions/subscribe', data);
  },
  getMySubscription: () => {
    return api.get('/api/subscriptions/minha-assinatura');
  },
  cancelSubscription: () => {
    return api.post('/api/subscriptions/cancel');
  }
};

export default subscriptionService; 