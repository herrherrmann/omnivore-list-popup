import browser from 'webextension-polyfill'
import { addLink } from '../services/api'
import {
	resetBadgeText,
	setErrorBadgeText,
	setSuccessBadgeText,
} from '../services/badge'
import { getActiveTab } from '../services/tabs'

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
