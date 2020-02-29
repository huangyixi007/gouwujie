import originAxios from 'axios'

export default function axios(option) {
	return new Promise((resolve, reject) => {
		const instance = originAxios.create({
			baseURL: 'http://123.207.32.32:8000/api/wh' || 'http://106.54.54.237:8000/api/wh',
			timeout: 5000
		})

		// 响应数据拦截
		instance.interceptors.response.use(response => response.data, err => {
			if (err && err.response) {
				switch (err.response.status) {
					case 400:
						err.message = '请求错误';
						break
					case 401:
						err.message = '未授权的访问';
						break
				}
			}
			return err
		})

		// 进行网络请求
		instance(option).then(res => resolve(res)).catch(err => reject(err))
	})
}
