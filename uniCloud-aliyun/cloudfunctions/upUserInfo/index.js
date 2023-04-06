const db = uniCloud.database()
exports.main = async (event, context) => {
	const upKey = event.upKey;
	let obj = {};
	for(let key in event){
		if(key != '_id'){
			obj[key] = event[key]
		}
	}
	const collection = db.collection('users')
	// 获取 user 表的集合对象
	let res = await collection.doc(event._id).update(
		upKey=='all'?obj:{[upKey]:event[upKey]},
	)
	return {
		code: 10,
		msg: '更新成功',
		info:event
	}
}