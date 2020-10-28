let baseUrl = ''
if (process.env.NODE_ENV === 'development') {
	// baseUrl = 'https://goods.ergouphp.com/api/'
	baseUrl = 'https://m.aisunsy.cn/api/'
}
if (process.env.NODE_ENV === 'production') {
	// baseUrl = 'https://m.aisunsy.cn/api/'
}
// baseUrl = 'https://m.aisunsy.cn/api/'
// baseUrl = 'http://www.goods.com/api/'
baseUrl = 'http://www.ergouphp.com/api/'
function request(url, method, data, header) {
	let token = uni.getStorageSync('token')
	return new Promise((resolve, reject) => {
		uni.request({
			url: baseUrl + url,
			method: method,
			data: data,
			header: header || {
				'Authorization': token,
				'content-type': 'application/json'
			},
			success: res => {
				resolve(res.data)
				if (res.code != 200) {
					showError(res.data)
				}
			},
			fail: res => {
				reject(res.data)
				uni.showToast({
					title: '请求资源未找到',
					duration: 2000,
					icon: 'none',
					position: 'top',
				})
			},
			complete: () => {
				
			}
		})
	})
}

//响应处理
function showError(error) {
	let code = error.code
	switch (code) {
		case 202:
			getApp().globalData.islogin = false
			uni.showModal({
				showCancel: true,
				title: '未授权',
				content: '是否前往授权页面',
				success: function(res) {
					if (res.confirm) {
						getApp().globalData.islogin = false
						uni.removeStorageSync('token')
						uni.navigateTo({
							url: '/pages/login/login'
						})
					} else if (res.cancel) {
						getApp().globalData.islogin = true
						uni.navigateBack()
					}
				}
			});
			break;
	}
}

function get(obj) {
	return request(obj.url, 'GET', obj.data, obj.header)
}

function post(obj) {
	return request(obj.url, 'POST', obj.data, obj.header)
}

function del(obj) {
	return request(obj.url, 'DELETE', obj.data, obj.header)
}
export default {
	request,
	get,
	post,
	del,
}
