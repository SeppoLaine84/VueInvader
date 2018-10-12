import Vue from 'vue';
import App from './App.vue';

Vue.config.productionTip = true;

Vue.component('modal', require('./components/Modal.vue').default);

new Vue({
    render: h => h(App)
}).$mount('#app');
