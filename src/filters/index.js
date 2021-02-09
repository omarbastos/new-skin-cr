import Vue from 'vue';
Vue.filter('formatNumber', (num) => {
  return new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: 'CRC',
  }).format(num);
});

Vue.filter('formatDate', (date) => {
  return new Intl.DateTimeFormat('en-CR').format(new Date(date));
});
