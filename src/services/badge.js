import browser from 'webextension-polyfill'

const action =
	browser.runtime.getManifest().manifest_version === 3
		? browser.action
		: browser.browserAction

export async function setSuccessBadgeText(text, tabId) {
	await action.setBadgeBackgroundColor({
		color: '#2ac3a2',
		tabId,
	})
	await action.setBadgeText({ text, tabId })
}

export async function setErrorBadgeText(text, tabId) {
	await action.setBadgeBackgroundColor({
		color: '#c50042',
		tabId,
	})
	await action.setBadgeText({ text, tabId })
}

export async function resetBadgeText(tabId) {
	await action.setBadgeText({ text: '', tabId })
	await action.setBadgeBackgroundColor({ color: null, tabId })
}
