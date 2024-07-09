import { createRouter, createWebHistory } from 'vue-router'

import VueCookies from 'vue-cookies'

const routes = [
  {
    path: '/',
    name: '/',
    // meta: { requiresAuth: true }, // 로그인 필요 페이지
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    meta: { requiresAuth: false },
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/LogIn.vue')
  },
  {
    path: '/main',
    name: 'main',
    meta: { requiresAuth: true },
    // meta: { requiresAuth: true }, // 로그인 필요 페이지
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/MainView.vue')
  },
  {
    path: '/customerpo',
    name: 'customerpo',
    meta: { requiresAuth: true },
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/CustomerPO.vue')
  },
  {
    path: '/monthly',
    name: 'monthly',
    meta: { requiresAuth: true },
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/MonthlyShipping.vue')
  },
  {
    path: '/daily',
    name: 'daily',
    meta: { requiresAuth: true },
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/DailyShipping.vue')
  },
  {
    path: '/production',
    name: 'production',
    meta: { requiresAuth: true },
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/ProductionHistory.vue')
  },
  {
    path: '/shippingorder',
    name: 'shippingorder',
    meta: { requiresAuth: true },
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/ShippingOrder.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // 인증이 필요한 페이지인 경우
    const period = 1000 * 60 * 60 * 8 // 8시간
    const now = new Date()
    const time = now.getTime()
    const logintime = VueCookies.get('userCookie').time
    if (logintime + period < time) {
      // 로그인 상태가 아니면 로그인 페이지로 이동
      VueCookies.remove('userCookie')
      next('/login')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
