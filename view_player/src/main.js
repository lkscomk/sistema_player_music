import '@mdi/font/css/materialdesignicons.css'
import '@/plugins/axios'
import '@/plugins/validate'
import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import Vuex from 'vuex'
import store from './store'

Vue.use(Vuex)

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
