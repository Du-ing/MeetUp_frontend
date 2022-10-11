import request from '../request'

export function login(data) {
  return request({
    url: '/peach/authentication/form',
    method: 'post',
    data
  })
}

export function getUserInfo(params) {
  return request({
    url: '/user/info',
    method: 'get',
    params
  })
}
