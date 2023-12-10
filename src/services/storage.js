import browser from 'webextension-polyfill'

const settingKeys = ['apiKey']

export async function loadSetting(settingKey) {
	if (!settingKeys.includes(settingKey)) {
		throw new Error('Invalid setting key')
	}
	function onGot(result) {
		return Promise.resolve(result[settingKey])
	}
	function onError(error) {
		return Promise.reject(error)
	}
	const getting = browser.storage.sync.get(settingKey)
	return getting.then(onGot, onError)
}

export async function saveSetting(settingKey, settingValue) {
	if (!settingKeys.includes(settingKey)) {
		throw new Error('Invalid setting key')
	}
	function onSet() {
		return Promise.resolve()
	}
	function onError(error) {
		return Promise.reject(error)
	}
	browser.storage.sync.set({ [settingKey]: settingValue }).then(onSet, onError)
}
