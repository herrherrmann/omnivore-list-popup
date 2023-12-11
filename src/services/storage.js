import browser from 'webextension-polyfill'

function checkSettingKey(settingKey) {
	const settingKeys = ['apiKey']
	if (!settingKeys.includes(settingKey)) {
		throw new Error('Invalid setting key')
	}
}

export async function loadSetting(settingKey) {
	checkSettingKey(settingKey)
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
	checkSettingKey(settingKey)
	function onSet() {
		return Promise.resolve()
	}
	function onError(error) {
		return Promise.reject(error)
	}
	browser.storage.sync.set({ [settingKey]: settingValue }).then(onSet, onError)
}
