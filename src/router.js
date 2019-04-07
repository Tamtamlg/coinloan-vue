import Vue from 'vue'
import Router from 'vue-router'
import Budgets from './views/Budgets.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/budgets'
    },
    {
      path: '/budgets',
      name: 'budgets',
      component: Budgets
    },
    {
      path: '/budgets/:id',
      name: 'budget',
      component: () => import('./views/Budget.vue')
    },
    {
      path: '*',
      redirect: '/budgets'
    }
  ]
})
