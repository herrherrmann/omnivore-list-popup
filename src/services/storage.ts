import browser from 'webextension-polyfill'

export type SettingKey = 'apiUrl' | 'apiKey' | 'searchQuery'

export const defaultSettings = {
	apiUrl: 'https://api-prod.omnivore.app/api/graphql',
	searchQuery: 'in:inbox',
}

function hasDefaultSetting(
	settingKey: SettingKey,
): settingKey is keyof typeof defaultSettings {
	return settingKey in defaultSettings
}

function checkSettingKey(settingKey: 'apiUrl' | 'apiKey' | 'searchQuery') {
	const settingKeys = ['apiUrl', 'apiKey', 'searchQuery']
	if (!settingKeys.includes(settingKey)) {
		throw new Error('Invalid setting key')
	}
}

export async function loadSetting(settingKey: SettingKey) {
	checkSettingKey(settingKey)
	async function onGot(result: Record<SettingKey, any>) {
		const value = result[settingKey]
		if (value === undefined && hasDefaultSetting(settingKey)) {
			const defaultValue = defaultSettings[settingKey]
			await saveSetting(settingKey, defaultValue)
			return Promise.resolve(defaultValue)
		}
		return Promise.resolve(value)
	}
	function onError(error: any) {
		return Promise.reject(error)
	}
	const getting = browser.storage.sync.get(settingKey)
	return getting.then(onGot, onError)
}

export async function saveSetting(
	settingKey: SettingKey,
	settingValue: string | object,
) {
	checkSettingKey(settingKey)
	function onSet() {
		return Promise.resolve()
	}
	function onError(error: any) {
		return Promise.reject(error)
	}
	browser.storage.sync.set({ [settingKey]: settingValue }).then(onSet, onError)
}

export type LocalStorageKey = 'apiCache'

export async function saveLocal(key: LocalStorageKey, value: string | object) {
	const onSet = () => Promise.resolve()
	const onError = (error: any) => Promise.reject(error)
	browser.storage.local.set({ [key]: value }).then(onSet, onError)
}

export async function loadLocal(key: LocalStorageKey) {
	function onGot(result: Record<LocalStorageKey, any>) {
		const value = result[key]
		return Promise.resolve(value)
	}
	const onError = (error: any) => Promise.reject(error)
	return browser.storage.local.get(key).then(onGot, onError)
}
