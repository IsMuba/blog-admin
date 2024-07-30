import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../views/LoginPage.vue'
import MainBox from '../views/MainBox.vue'
import routeConfig from './config.js'
import store from '@/store'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/reg',
    name: 'reg',
    component: Login
  },
  {
    path: '/mainbox',
    name: 'mainbox',
    component: MainBox
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.name === 'login' || to.name === 'reg') {
    next()
  } else {
    if (!localStorage.getItem('token')) {
      next({
        path: '/login'
      })
    } else {
      if (!store.state.isGetterRouter) {
        router.removeRoute('mainbox')
        addRouteDynamic()
        next({
          path: to.fullPath
        })
      } else {
        next()
      }
    }
  }
})

function addRouteDynamic() {
  if (!router.hasRoute('mainBox')) {
    router.addRoute('mainbox', {
      path: '/mainbox',
      name: 'mainbox',
      component: MainBox
    })
  }
  routeConfig.forEach((item) => {
    checkPermission(item) && router.addRoute('mainbox', item)
  })
  store.commit('changeGetterRouter', true)
}

function checkPermission(item) {
  if (item.requireAdmin) {
    return store.state.userInfo.role === 1
  }
  return true
}

export default router
