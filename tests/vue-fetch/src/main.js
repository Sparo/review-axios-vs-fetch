import './assets/css/global.css';

import Vue from 'vue'
import App from './components/App.vue'
import Api from './plugins/api';

// Vue.use(Api, { baseURL: 'https://jsonplaceholder.typicode.com' });
Vue.use(Api, { baseURL: 'http://localhost:3000' });

Vue.config.productionTip = false

new Vue({
  render: function (h) {
    return h(App, {
      props: {
        userId: 1
      }
    })
  },
}).$mount('#app')
