import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../page/login.vue'
import MeetingList from '../page/meeting_list.vue'
import Home from '../page/home.vue'
import Sign from '../components/sign/sign.vue'
import SignList from '../components/sign/sign_list.vue'
import InteractiveWall from '../page/barrage-landscape.vue'
import Lotterty from '../components/lottery/lottery.vue'
import LottertyLandscan from '../page/lottery-landscan.vue'
import VoteList from '../components/vote/vote_list'
import VoteAccount from '../components/vote/vote_account'
import VoteLandscan from '../page/vote-landscan.vue'
import SignLandscan from '../page/sign-landscan.vue'
import File from '../components/file/file.vue'
import Webrtc from '../page/webrtc-room.vue'
import MeetingMessage from '../components/meeting_message/meeting_message.vue'
import Comment from '../components/meeting_message/comment.vue'
import Announce from '../components/meeting_message/announce.vue'
import LottertyZhong from '../components/lottery/lottery_zhong'

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
    path: '/interactive_wall',
    name: 'interactive_wall',
    component: InteractiveWall
  },
  {
    path: '/lottery_wall',
    name: 'lottery_wall',
    component: LottertyLandscan
  },
  {
    path: '/sign_wall',
    name: 'sign_wall',
    component: SignLandscan
  },
  {
    path: '/vote_wall',
    name: 'vote_wall',
    component: VoteLandscan
  },
  {
    path: '/webrtc-room',
    name: 'webrtc-room',
    component: Webrtc
  },
  {
    // 匹配动态id
    path: '/home/:id',
    name: 'home',
    component: Home,
    children: [
      {
        path: '/sign',
        component: Sign
      },
      {
        path: '/sign_list',
        component: SignList
      },
      {
        path: '/lottery',
        component: Lotterty
      },
      {
        path: '/lottery_zhong',
        component: LottertyZhong
      },
      {
        path: '/vote_list',
        component: VoteList
      },
      {
        path: '/vote_account',
        component: VoteAccount
      },
      {
        path: '/file',
        component: File
      },
      {
        path: '/meeting_message',
        component: MeetingMessage
      },
      {
        path: '/comment',
        component: Comment
      },
      {
        path: '/announce',
        component: Announce
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
// const routerReplace = VueRouter.prototype.replace
// VueRouter.prototype.push = function push(location) {
//   return routerReplace.call(this, location).catch(error => error)
// }
export default router
