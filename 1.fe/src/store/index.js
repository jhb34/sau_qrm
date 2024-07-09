import { createStore } from 'vuex'
import axios from 'axios'

export default createStore({
  state() {
    return {
      user: null,
      todos: [
        { id: 1, title: 'todo 1', done: true },
        { id: 2, title: 'todo 2', done: false },
        { id: 3, title: 'todo 3', done: false }
      ]
    }
  },
  getters: {},
  mutations: {
    setLoggedIn(state, isLoggedIn) {
      state.isLoggedIn = isLoggedIn
    },
    setUser(state, user) {
      state.user = user
    }
  },
  actions: {
    login({ commit }, user) {
      // 로그인 요청 API 호출
      // 성공 시 Vuex 상태 업데이트
      commit('setLoggedIn', true)
      commit('setUser', user)
    },
    logout({ commit }) {
      // 로그아웃 요청 API 호출
      // 성공 시 Vuex 상태 초기화
      commit('setLoggedIn', false)
      commit('setUser', null)
    },
    async checkLoginStatus({ commit }) {
      try {
        const r = await this.$get('/api/user') // 백엔드에서 현재 사용자 정보를 확인하는 API
        console.log(r)

        const user = r.data
        commit('setLoggedIn', true)
        commit('setUser', user)
      } catch (error) {
        commit('setLoggedIn', false)
        commit('setUser', null)
      }
    },
    add3({ commit }) {
      axios.get('/get').then((res) => {
        commit('setLoggedIn', true)
        commit('setUser', res.data)
      })
    },

    async add1({ commit }) {
      const r = await this.$get('/get')
      console.log(r)
    },
    add2: async ({ commit }) => {
      const r = await this.$get('/get')
      console.log(r)
    }
  },
  modules: {}
})
