import browser from 'webextension-polyfill'
import { addLink } from './src/services/api.ts'
import {
	resetBadgeText,
	setErrorBadgeText,
	setSuccessBadgeText,
} from './src/services/badge.ts'
import { getActiveTab } from './src/services/tabs.ts'

browser.commands.onCommand.addListener(async (command) => {
	if (command === 'add_current_page') {
		const activeTab = await getActiveTab()
		const tabId = activeTab.id as number
		setSuccessBadgeText('+', tabId)
		try {
			if (!activeTab.url) {
				throw Error('No tab url')
			}
			await addLink(activeTab.url)
			await setSuccessBadgeText('✔︎', tabId)
		} catch (error) {
			await setErrorBadgeText('✗', tabId)
		} finally {
			setTimeout(() => {
				resetBadgeText(tabId)
			}, 2_000)
		}
	}
})
