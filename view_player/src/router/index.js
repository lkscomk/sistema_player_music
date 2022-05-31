import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('@/layout/'),
    children: [
      {
        path: '',
        name: 'Início',
        component: () => import('@/views/inicio/')
      }
    ],
    beforeEnter: (to, from, next) => localStorage.getItem('user:token') ? next() : next('/login')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
