import Cookies from 'js-cookie'

const state = {
  user_id: undefined || localStorage.getItem('user_id'),
  username: undefined || localStorage.getItem('username')
}

const getters = {
  user_id: (state) => state.user_id,
  username: (state) => state.username,
  avatar: (state) => state.avatar
}

const mutations = {
  storeUserInfo: (state, user_info) => {
    console.log(user_info)
    state.user_id = user_info.id
    state.username = user_info.username
    state.avatar = user_info.icon
    localStorage.setItem('user_info', user_info.id)
    localStorage.setItem('username', user_info.username)
    localStorage.setItem('avatar', user_info.icon)
  },

  removeUserInfo: (state) => {
    state.user_id = undefined
    state.username = undefined
    state.avatar = undefined
    localStorage.removeItem('user_id')
    localStorage.removeItem('username')
    localStorage.removeItem('avatar')
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations
}
