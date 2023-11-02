import Vue from 'vue';
import Message from 'vue-m-message';
import 'vue-m-message/dist/index.css';

import App from './App.js';
import router from './router';
import store from './store';
import './lib/filters';

Vue.config.productionTip = false;
Vue.use(Message, { name: 'toast' });

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
