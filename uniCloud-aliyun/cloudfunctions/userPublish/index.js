// 个人动态表
const db = uniCloud.database()
//个人状态发布后，同步发布公共频道
exports.main = async (event, context) => {
	event = JSON.parse(event.body)
	const isSecret = event['isSecret'];//是否私密--默认否
	const collection = db.collection('userPublish')
	const publicDataCollection = db.collection('publicData')
	if(event.type == 'get'){//用户id查
		let list = await collection.where({userId:event.userId}).get()
		return {
			code:10,
			msg:'信息查询成功',
			list
		}
	}else if(event.type == 'remove'){//删除个人同步删除公共
		await collection.doc(event._id).remove()
		let pubArr = await publicDataCollection.where({_id:event._id}).get();
		if(pubArr.affectedDocs > 0){//公库也有
			await publicDataCollection.doc(event._id).remove()
		}
		return {
			code:10,
			msg:'删除成功'
		}
	}else{
		let add = await collection.add(event)
		let newEvent = await collection.where({_id:add.id}).get()
		newEvent.data[0].secretId = newEvent.data[0]._id;//同步公共-私密_id
		if(!isSecret){
			await publicDataCollection.add(newEvent.data[0])//非私密，同步发布公共栏目
		}
		return {
			code:10,
			msg:'信息发布成功'
		}
	}
}
