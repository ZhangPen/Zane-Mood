// 公共动态表
const db = uniCloud.database()
exports.main = async (event, context) => {
	event = JSON.parse(event.body)
	const userCollection = db.collection('userPublish')
	const publicDataCollection = db.collection('publicData')
	if(event.type == 'upDate'){//更新单条数据==》评论/点赞收藏
		const obj = Object.assign({}, event);
		delete obj._id
		let pubArr = await publicDataCollection.where({_id:event._id}).get();
		let userArr = await userCollection.where({_id:event._id}).get();
		obj.commentNum = obj.commentList?obj.commentList.length:0;
		if(pubArr.affectedDocs < 1){//公共没找到==》私密
			await userCollection.doc(event._id).update(obj)
		}else if(userArr.affectedDocs < 1){//私密没找到==》公共
			await publicDataCollection.doc(event._id).update(obj)
		}else{
			await userCollection.doc(event._id).update(obj)
			await publicDataCollection.doc(event._id).update(obj)
		}
		return {
			code:10,
			msg:'更新成功'
		}
	}else if(event.type == 'search'){//搜索页面
		let allArr = await publicDataCollection.where({}).get()
		return {
			code:10,
			msg:'信息查询成功',
			list:allArr
		}
	}else if(event.type == 'delete'){//删除所有/个人--管理员
		await publicDataCollection.where({}).remove()
		await userCollection.where({}).remove()
		return {
			code:10,
			msg:'删除成功',
		}
	}else{//查
		let list = []
		if(event._id){//具体某个id查详情
			list = await publicDataCollection.where({_id:event._id}).get()
		}else {//时间条件查询
			list = await publicDataCollection.where({time:event.time}).get()
		}
		if(!list.data.length && event._id){//私有个人库里
			list = await userCollection.where({_id:event._id}).get()
		}
		return {
			code:10,
			msg:'信息查询成功',
			list
		}
	}
}
