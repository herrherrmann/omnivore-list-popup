export async function setSuccessBadgeText(text, tabId) {
	await browser.browserAction.setBadgeBackgroundColor({
		color: '#2ac3a2',
		tabId,
	})
	await browser.browserAction.setBadgeText({
		text,
		tabId,
	})
}

export async function setErrorBadgeText(text, tabId) {
	await browser.browserAction.setBadgeBackgroundColor({
		color: '#c50042',
		tabId,
	})
	await browser.browserAction.setBadgeText({
		text,
		tabId,
	})
}

export async function resetBadgeText(tabId) {
	await browser.browserAction.setBadgeText({
		text: '',
		tabId,
	})
	await browser.browserAction.setBadgeBackgroundColor({
		color: null,
		tabId,
	})
}
