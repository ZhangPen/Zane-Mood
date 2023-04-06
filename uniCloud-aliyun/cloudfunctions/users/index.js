const { log } = require("console");

const db = uniCloud.database()
exports.main = async (event, context) => {
	const userType = event.userType; //sign:登陆-create:注册
	const collection = db.collection('users')
	// 获取 user 表的集合对象
	let user = await collection.where({
		name: event.name,
	}).get()

	const msg = [
		{
			code: -1,
			msg: '用户名/密码错误'
		},
		{
			code: 10,
			msg: '登陆成功',
			info:user.data[0],
			time:new Date().getTime()
		},
		{
			code: -1,
			msg: '用户名已存在'
		}
	]
	if (userType == 'sign') { //登陆
		if (user.affectedDocs < 1) { // affectedDocs 当做找到的个数
			return msg[0]
		}
		return msg[1]
	} else {//注册
		if (user.affectedDocs < 1) { // affectedDocs 当做找到的个数
			await collection.add(event)
			let regUser = await collection.where({
				name: event.name,
			}).get()
			return {
				code: 10,
				msg: '注册成功',
				info:regUser,
				time:new Date().getTime()
			}
		}
		return msg[2]
	}
}
