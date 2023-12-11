import browser from 'webextension-polyfill'

const defaultSettings = {
	searchQuery: 'in:inbox',
}

function checkSettingKey(settingKey) {
	const settingKeys = ['apiKey', 'searchQuery']
	if (!settingKeys.includes(settingKey)) {
		throw new Error('Invalid setting key')
	}
}

export async function loadSetting(settingKey) {
	checkSettingKey(settingKey)
	async function onGot(result) {
		const value = result[settingKey]
		const defaultValue = defaultSettings[settingKey]
		if (value === undefined && defaultValue) {
			await saveSetting(settingKey, defaultValue)
			return Promise.resolve(defaultValue)
		}
		return Promise.resolve(value)
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
