const format = (date, fmt) => {
	if (typeof date == 'string') {
		return date;
	}

	if (!fmt) fmt = "yyyy-MM-dd hh:mm:ss";

	if (!date || date == null) return null;
	let o = {
		'M+': date.getMonth() + 1, // 月份
		'd+': date.getDate(), // 日
		'h+': date.getHours(), // 小时
		'm+': date.getMinutes(), // 分
		's+': date.getSeconds(), // 秒
		'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
		'S': date.getMilliseconds() // 毫秒
	}
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
	for (let k in o) {
		if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : ((
			'00' + o[k]).substr(('' + o[k]).length)))
	}
	return fmt
}

const blobToBase64 = (url) => {
	const blob = new Blob([url])
	return new Promise((resolve, reject) => {
		const fileReader = new FileReader();
		fileReader.readAsDataURL(blob);
		fileReader.onload = (e) => {
			resolve(e.target.result);
		};
		fileReader.onerror = () => {
			reject(new Error('blobToBase64 error'));
		};
	});
}

const isLogin = (time) => {
	let loginTime = new Date(time);
	let outTime = new Date(loginTime.setMinutes(loginTime.getMinutes() + 3)).getTime(); //3分钟后
	let nowTime = new Date().getTime();

	if (nowTime < outTime) {
		return false;
	}
	return true;
}

export default {
	format,
	blobToBase64,
	isLogin
}
