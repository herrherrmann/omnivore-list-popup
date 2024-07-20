import browser from 'webextension-polyfill'

/**
 * @returns {Promise<import('webextension-polyfill').Tabs.Tab>} active browser tab
 */
export async function getActiveTab() {
	function onGot(tabs: browser.Tabs.Tab[]) {
		const activeTab = tabs[0]
		return Promise.resolve(activeTab)
	}
	function onError(error: any) {
		return Promise.reject(error)
	}
	const querying = browser.tabs.query({ active: true, currentWindow: true })
	return querying.then(onGot, onError)
}

export function openTab(url: string, active = true) {
	return browser.tabs.create({ url, active: active })
}
