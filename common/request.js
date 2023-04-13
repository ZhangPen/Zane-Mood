const doMain = 'https://fc-mp-4f151b53-52b1-4351-a7fe-ea103ea5cadf.next.bspapp.com/http/'

export default{
	//封装uni.request()：
	request(options){
		uni.showLoading()
		return new Promise((resolve,reject)=>{
			//书写异步操作的代码
			uni.request({
				...options,
				success:res=>{
					if(options.native){
						uni.hideLoading()
						resolve(res)	//调取接口后返回的原生数据	
					}
					if(res.statusCode === 200){
						uni.hideLoading()
						resolve(res.data)	//异步操作执行成功
					}else{
						console.log('请求的接口没有找到');
						uni.hideLoading()
						reject(res) 	//异步操作执行失败
					}
				}
			})
		})
	},
	get(url,data={},options={}){
		options.url=doMain + url;
		options.data=data;
		options.method='get';
		options.headers={
			'Content-Type': 'application/json',
			'Authorization': 'Bearer token'
	    }
		return this.request(options)
	},
	post(url,data={},options={}){
		options.url=doMain + url;
		options.data=data;
		options.method='post';
		options.headers={
			'Content-Type': 'application/json',
			'Authorization': 'Bearer token',
		}
		return this.request(options)
	}
 
}