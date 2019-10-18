const axios = require('axios');

const BASE_URL = 'https://fissa.shopware.matise.nl';
const SW_ACCESS_TOKEN = 'SWSCUJRIWK8WBWFLU3C1AGZLNA';

const $axios = axios.create({
	baseURL: BASE_URL,
	headers: {
		'sw-access-key': SW_ACCESS_TOKEN,
		'Content-Type': 'application/json',
		Accept: 'application/json'
	}
});

try {
	$axios({
		method: 'post',
		url: `/sales-channel-api/v1/checkout/cart`
	}).then((response) => {
		if (response && response.data && response.data['sw-context-token']) {
			return response.data['sw-context-token'];
		}
	}).then((token) => {
		$axios({
			method: 'post',
			headers: {
				'sw-context-token': token
			},
			url: `/sales-channel-api/v1/checkout/cart/product/1c5d28c814cf4069a8b59cc20b3cff03`
		}).then((res) => {
			if (res && res.data && res.data.data) {
				Promise.all([
					getCategoryPage(token), getProductPage(token)
				]).then(() => {
					console.log('succes');
				}).catch((e) => {
					console.log(e.response.data)
				})
			}
		});
	});
} catch (e) {
	console.log(e)
}

const getCategoryPage = (swToken) => {
	return new Promise(async (resolve, reject) => {
		const response = await $axios({
			method: 'get',
			url: '/sales-channel-api/v1/category',
			headers: {
				'sw-context-token': swToken
			}
		}).catch(reject);

		if (response && response.data && response.data.data && response.data.data.length) {
			return resolve(response.data.data[0]);
		}
		return reject(404);
	});
}

const getProductPage = (swToken) => {
	return new Promise(async (resolve, reject) => {
		const response = await $axios({
			method: 'get',
			url: '/sales-channel-api/v1/product',
			headers: {
				'sw-context-token': swToken
			}
		}).catch(reject);

		if (response && response.data && response.data.data && response.data.data.length) {
			return resolve(response.data.data[0]);
		}
		return reject(404);
	});
}