import axios from 'axios'
import stores from '../stores'
import {
  Code
} from '../assets/js/operaCode'

let http = axios.create({
  // baseURL: window.api_host,
  headers: {
    post: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    }
  }
})
http.interceptors.request.use(config => {
  let token = stores.token
  if (token) {
    config.headers['Authorization'] = token
  }
  return config
}, () => {
  return Promise.reject(new Error({
    code: Code.Error,
    msg: '操作失败！'
  }))
})

http.interceptors.response.use(res => {
  return res
}, err => {
  if (err.message === 'Network Error') {
    return Promise.reject(new Error({
      code: Code.Offline,
      msg: '网络连接超时，请稍后重试！'
    }))
  } else {
    return Promise.reject(new Error({
      code: Code.Error,
      msg: '系统错误，请稍后重试！'
    }))
  }
})

function successHandle(response) {
  if (response.data && response.data.code === 1) {
    response.errCode = 1
    return response.data
  } else {
    return Promise.reject(response.data)
  }
}

function errorHandle(err) {
  err = Object.assign({
    code: Code.Error,
    msg: '操作失败！'
  }, err)
  err.errCode = err.code
  if (err.code === -101 || err.code === -102) {
    err.code = Code.Overdue
    err.msg = '用户信息已过期，请重新登录！'
  } else if (err.code === -104 || err.code === -106) {
    err.code = Code.NoAuth
    err.msg = '无权限访问,请联系系统管理员！'
  } else if (err.code === Code.Offline) {
    err.code = Code.Offline
  } else if (err.code === Code.Other) {
    err.code = Code.Other
  } else {
    err.code = Code.Error
  }
  return Promise.reject(err)
}

function sendRequest(method, url, params, type) {
  var response = http({
    // baseURL: type === 'new' ? window.new_api_host : window.api_host,
    baseURL: 'http://result.eolinker.com/Xqkc6Hsab40971d62256e684b7e73c3e9008076b8db5f32?uri=/react',
    url: url,
    method: method,
    params: params
  })
  return response.then(successHandle).catch(errorHandle)
}

export default {
  get(url, params, type) {
    return sendRequest('get', url, params, type)
  },
  post(url, params, type) {
    return sendRequest('post', url, params, type)
  }
}
