import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../page/login.vue'
import MeetingList from '../page/meeting_list.vue'
import Home from '../page/home.vue'
import Sign from '../components/sign.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: 'login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/meeting_list',
    name: 'meeting_list',
    component: MeetingList
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    children: [
      {
        path: '/sign',
        component: Sign
      }
    ]
  }
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  routes
})
// 用路由是守卫判断是否登录
router.beforeEach((to, from, next) => {
  // 从sessionStrage中获取token
  // to.path判断用户将要访问路径 如果直接到登录页,就放行
  if (to.path === '/login') return next()
  // 否则提取token,有就转到主页,没有就强制回到登录页
  const tokened = window.sessionStorage.getItem('token')
  if (!tokened) return next('/login')
  next()
})
export default router
