import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 导入axios
import axios from 'axios'
// 全局样式
import './assets/css/global.css'

import 'element-ui/lib/theme-chalk/index.css'
import ele from './element-ui/ele'

axios.defaults.baseURL = 'http://127.0.0.1:8000/'
// 配置请求拦截器，将token加到请求头以有权限访问一些api
axios.interceptors.request.use(config => {
  config.headers['Content-Type'] = 'application/json'
  config.headers.token = window.sessionStorage.getItem('token')
  return config // 需要返回config,不然出错
})
// 把axios挂载到vue原型链上，这样每一个vue都可以通过this使用axios
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  ele,
  router,
  render: h => h(App)
}).$mount('#app')
