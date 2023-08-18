export async function getActiveTab() {
	function onGot(tabs) {
		const activeTab = tabs[0]
		return Promise.resolve(activeTab)
	}
	function onError(error) {
		return Promise.reject(error)
	}
	const querying = chrome.tabs.query({ active: true, currentWindow: true })
	return querying.then(onGot, onError)
}

export function openTab(url) {
	return chrome.tabs.create({ url })
}
