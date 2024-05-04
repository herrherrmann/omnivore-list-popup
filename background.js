import browser from 'webextension-polyfill'
import { addLink } from './src/services/api'
import {
	resetBadgeText,
	setErrorBadgeText,
	setSuccessBadgeText,
} from './src/services/badge'
import { getActiveTab } from './src/services/tabs'

browser.commands.onCommand.addListener(async (command) => {
	if (command === 'add_current_page') {
		const activeTab = await getActiveTab()
		setSuccessBadgeText('+', activeTab.id)
		try {
			await addLink(activeTab.url)
			await setSuccessBadgeText('✔︎', activeTab.id)
		} catch (error) {
			await setErrorBadgeText('✗', activeTab.id)
		} finally {
			setTimeout(() => {
				resetBadgeText(activeTab.id)
			}, 2_000)
		}
	}
})
