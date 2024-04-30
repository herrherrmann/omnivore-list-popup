import browser from 'webextension-polyfill'

export const defaultSettings = {
	apiUrl: 'https://api-prod.omnivore.app/api/graphql',
	searchQuery: 'in:inbox',
}

/**
 * @param {('apiUrl' | 'apiKey' | 'searchQuery')} settingKey
 */
function checkSettingKey(settingKey) {
	const settingKeys = ['apiUrl', 'apiKey', 'searchQuery']
	if (!settingKeys.includes(settingKey)) {
		throw new Error('Invalid setting key')
	}
}

/**
 * @param {('apiUrl' | 'apiKey' | 'searchQuery')} settingKey
 */
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

/**
 * @param {('apiUrl' | 'apiKey' | 'searchQuery')} settingKey
 * @param {string | object} settingValue String or object to store in the specified settingKey
 */
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

/**
 * @param {('apiCache')} key
 * @param {string | object} value String or object to store in the specified key
 */
export async function saveLocal(key, value) {
	const onSet = () => Promise.resolve()
	const onError = (error) => Promise.reject(error)
	browser.storage.local.set({ [key]: value }).then(onSet, onError)
}

/**
 * @param {('apiCache')} key
 */
export async function loadLocal(key) {
	function onGot(result) {
		const value = result[key]
		return Promise.resolve(value)
	}
	const onError = (error) => Promise.reject(error)
	return browser.storage.local.get(key).then(onGot, onError)
}
