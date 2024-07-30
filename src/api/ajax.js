import axios from 'axios'
import { ElNotification } from 'element-plus'

// 统一接口前缀
// eslint-disable-next-line no-undef
const ApiPrefix = process.env.VUE_APP_BASE_API

// 创建axios实例
const service = axios.create({
  // baseURL: '',
  timeout: 5000 // 请求超时时间
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')

    if (token) {
      // 添加 Bearer 为一种约定
      config.headers.Authorization = `Bearer ${token}`
    }

    config.url = ApiPrefix + config.url

    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const { data, status } = response
    const { authorization } = response.headers
    authorization && localStorage.setItem('token', authorization)

    // 针对如图形验证码的特殊请求
    if (status === 200 && data && !data.code) {
      return data
    }

    if (data.code === 8302) {
      localStorage.removeItem('token')
      window.location.href = '#/login'
      ElNotification({
        type: 'error',
        title: '提示',
        message: '登录失效，请重新登录'
      })
      return
    }

    if (data.code !== 8200) {
      ElNotification({
        type: 'error',
        title: '提示',
        message: data.message || '请求失败'
      })
      return Promise.reject('error')
    }

    return data.data
  },
  (error) => {
    const { status } = error.response

    if (status === 404) {
      ElNotification({
        type: 'error',
        title: '提示',
        message: '404，接口不存在'
      })
      return Promise.reject(error)
    }

    ElNotification({
      type: 'error',
      message: '服务器错误'
    })
    return Promise.reject(error)
  }
)

export default service
