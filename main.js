import App from './App'
import store from './store'
import commonFn from './common/lib.js'
import http from './common/request.js'

// #ifndef VUE3
import Vue from 'vue'

Vue.config.productionTip = false;
App.mpType = 'app';
Vue.prototype.$store = store;
Vue.prototype.$commonFn = commonFn;
Vue.prototype.$http = http;

Vue.prototype.$uniCloud = async (name, data) => {
	uni.showLoading()
	try{
		let res = await uniCloud.callFunction({
		name, // 云函数名字
		data // 传输数据
	})
		return res
	} catch(e) {
		return e
	} finally{
		uni.hideLoading()
	}
}
try {
	function isPromise(obj) {
		return (
			!!obj &&
			(typeof obj === "object" || typeof obj === "function") &&
			typeof obj.then === "function"
		);
	}

	// 统一 vue2 API Promise 化返回格式与 vue3 保持一致
	uni.addInterceptor({
		returnValue(res) {
			if (!isPromise(res)) {
				return res;
			}
			return new Promise((resolve, reject) => {
				res.then((res) => {
					if (res[0]) {
						reject(res[0]);
					} else {
						resolve(res[1]);
					}
				});
			});
		},
	});
} catch (error) {}

const app = new Vue({
	store,
	...App
})
app.$mount()

// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	app.use(store)
	app.config.globalProperties.$commonFn = commonFn
	app.config.globalProperties.$http = http
	app.config.globalProperties.$uniCloud = async (name, data) => {
		uni.showLoading()
		try{
			let res = await uniCloud.callFunction({
			name, // 云函数名字
			data // 传输数据
		})
			return res
		} catch(e) {
			return e
		} finally{
			uni.hideLoading()
		}
	}
	return {
		app
	}
}
// #endif
