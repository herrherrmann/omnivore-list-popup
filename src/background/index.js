import browser from 'webextension-polyfill'
import { addLink } from '../services/api'
import { getActiveTab } from '../services/tabs'

browser.commands.onCommand.addListener(async (command) => {
	if (command === 'add_current_page') {
		const activeTab = await getActiveTab()
		await addLink(activeTab.url)
	}
})
