import axios from 'axios'
import { Message } from 'element-ui'
import { getToken } from './utils/cookie'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // api 的 base_url
  timeout: 120000 // 请求超时时间
})

// request拦截器设置
service.interceptors.request.use(
  config => {
    const token = getToken()
    if (token) {
      config.headers['Authorization'] = token // 请求头设置自带 token
    }
    config.headers['Content-Type'] = 'application/json' // 请求的数据格式为 json
    return config
  },
  error => {
    console.log(error)
    Promise.reject(error)
  }
)

// response 拦截器设置
service.interceptors.response.use(
  response => {
    const data = response.data
    const code = response.status
    const msg = data.msg
    if (code == 200) {
      return data
    } else {
      Message({
        type: 'error',
        msg
      })
      return Promise.reject('error')
    }
  },
  error => {
    const code = error.response.data.status
    const msg = error.response.data.msg
    if (code != 200) {
      Message({
        type: 'error',
        message: msg
      })
    }
    return Promise.reject(error)
  }
)

export default service
