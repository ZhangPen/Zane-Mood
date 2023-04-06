// #ifndef VUE3
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const store = new Vuex.Store({
			// #endif

			// #ifdef VUE3
			import {
				createStore
			} from 'vuex'
			const store = createStore({
				// #endif
				state: {
					loginTime:'',
					userInfo:{
						_id:'',
						userImg:[{
							url: './../static/login.jpeg',
							extname: 'jpeg',
							name: '默认头像.jpeg',
						}],//头像
						nickname:'',//昵称
						name:'',//用户名
						psw:'',//密码
						sex:3,//性别
						mood:'记录心情状态～',
						comment:''//评论
					},
				},
				mutations: {
					UP_LOGIN_TIME(state,str){
						state.loginTime = str
					},
					UP_USER_INFO(state,payload){
						state.userInfo = {...payload}
					},
					UP_MOOD(state,str){
						state.userInfo.mood = str
					},
					UP_USER_IMG(state,payload){
						state.userInfo.userImg = {...payload}
					},
				},
				actions: {
					setLoginTime(context,payload){
						context.commit('UP_LOGIN_TIME',payload)
					},
					setUserInfo(context,payload){
						context.commit('UP_USER_INFO',payload)
					},
					setMood(context,payload){
						context.commit('UP_MOOD',payload)
					},
					setUserImg(context,payload){
						context.commit('UP_USER_IMG',payload)
					},
				}
			})

			export default store
