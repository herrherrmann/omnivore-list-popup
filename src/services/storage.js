import browser from 'webextension-polyfill'

export async function loadApiKey() {
	function onGot(result) {
		return Promise.resolve(result.apiKey)
	}
	function onError(error) {
		return Promise.reject(error)
	}
	const getting = browser.storage.sync.get('apiKey')
	return getting.then(onGot, onError)
}

export async function saveApiKey(apiKey) {
	function onSet(result) {
		return Promise.resolve(result.apiKey)
	}
	function onError(error) {
		return Promise.reject(error)
	}
	browser.storage.sync.set({ apiKey }).then(onSet, onError)
}
