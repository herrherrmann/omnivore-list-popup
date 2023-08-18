export async function loadApiKey() {
	function onGot(result) {
		return Promise.resolve(result.apiKey)
	}
	function onError(error) {
		return Promise.reject(error)
	}
	const getting = chrome.storage.sync.get('apiKey')
	return getting.then(onGot, onError)
}

export async function saveApiKey(apiKey) {
	function onSet(result) {
		return Promise.resolve(result.apiKey)
	}
	function onError(error) {
		return Promise.reject(error)
	}
	chrome.storage.sync.set({ apiKey }).then(onSet, onError)
}
