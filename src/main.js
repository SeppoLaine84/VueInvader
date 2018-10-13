import Vue from 'vue';
import App from './App.vue';
import BootstrapVue from 'bootstrap-vue';

Vue.use(BootstrapVue);
Vue.config.productionTip = true;

Vue.component('modal', require('./components/Modal.vue').default);
Vue.component('C64Console', require('./components/C64Console.vue').default);

new Vue({
    render: h => h(App)
}).$mount('#app');
