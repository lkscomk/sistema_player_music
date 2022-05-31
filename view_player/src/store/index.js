import Vue from 'vue'
import Vuex from 'vuex'
import auth from '@/views/auth/store'
import app from './app'
// import VuexReset from '@ianwalter/vuex-reset'
// import axios from '@/plugins/axios'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    auth
  }
})
