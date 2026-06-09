import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		userInfo: uni.getStorageSync('userInfo') || null,
		token: uni.getStorageSync('token') || ''
	},
	mutations: {
		SET_USER_INFO(state, userInfo) {
			state.userInfo = userInfo
			uni.setStorageSync('userInfo', userInfo)
		},
		SET_TOKEN(state, token) {
			state.token = token
			uni.setStorageSync('token', token)
		},
		LOGOUT(state) {
			state.userInfo = null
			state.token = ''
			uni.removeStorageSync('userInfo')
			uni.removeStorageSync('token')
		}
	},
	actions: {
		login({ commit }, { userInfo }) {
			commit('SET_USER_INFO', userInfo)
			commit('SET_TOKEN', 'mock_token_' + Date.now())
		},
		logout({ commit }) {
			commit('LOGOUT')
		}
	},
	getters: {
		isLogin: state => !!state.token || !!uni.getStorageSync('token')
	}
})

export default store
