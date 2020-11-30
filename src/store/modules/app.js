import { getToken, setToken, removeToken } from '@/utils/auth'
import {loggedOut} from "@/api/user"
const state = {
  userName: '',
  token:getToken('access_token'),
}
const mutations = {
  SET_USER_NAME(state, name) {
    state.userName = name
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  }
}
const actions = {
  // 设置name
  setUserName({ commit }, name) {
    commit('SET_USER_NAME', name)
  },
  // 设置token
  setTOKEN({commit}, token) {
    commit('SET_TOKEN', token)
    setToken('access_token',token)
  },
  // 退出登陆
  async FedLogOut({ commit,state }) {
    commit('SET_TOKEN', '')
    removeToken('access_token')
    loggedOut(state.token)
  }
}
export default {
  state,
  mutations,
  actions
}
