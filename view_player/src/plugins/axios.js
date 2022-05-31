import Vue from 'vue'
import axios from 'axios'

const Axios = axios.create({
  baseURL: `${process.env.VUE_APP_API}`,
  headers: {
    Authorization: 'Bearer ' + localStorage.getItem('user:token')
  }
})

Vue.prototype.$axios = Axios

export default Axios
