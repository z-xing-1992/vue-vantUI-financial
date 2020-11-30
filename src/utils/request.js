import axios from 'axios'
import store from '@/store'
import router from 'vue-router'
import {getToken} from '@/utils/auth'
import { Toast,Dialog } from 'vant'
// 根据环境不同引入不同api地址
import { baseApi } from '@/config'
// create an axios instance
const service = axios.create({
  baseURL: baseApi, // url = base api url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request拦截器 request interceptor
service.interceptors.request.use(
  config => {
    // 不传递默认开启loading
    if (!config.hideloading) {
      // loading
      Toast.loading({
        forbidClick: true
      })
    }
    if (store.getters.token) {
      config.headers['Authorization'] = getToken('access_token')
    }
    config.headers['encryptKey'] = localStorage.getItem('encryptKey')
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)
// respone拦截器
service.interceptors.response.use(
  response => {
    Toast.clear()
    const res = response.data
    if (res.code && res.code !== 200) {
      // 登录超时,重新登录 403是无权访问
      if (res.code === 401) {
        Dialog.alert({
            message: "登陆凭证已失效，请重新登陆"
        }).then(() => {
          store.dispatch('FedLogOut').then(() => {
            window.location.href="/debtSystem/"
          })
        })
        return
      }
      return Promise.reject(res.msg || '系统出错，请联系管理员')
    } else {
      return Promise.resolve(res)
    }
  },
  error => {
    Toast.clear()
    console.log('err' + error) // for debug
    return Promise.reject(error)
  }
)

export default service
