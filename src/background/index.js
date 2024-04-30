import browser from 'webextension-polyfill'
import { addLink } from '../services/api'
import { getActiveTab } from '../services/tabs'

browser.commands.onCommand.addListener(async (command) => {
	if (command === 'add_current_page') {
		const activeTab = await getActiveTab()
		await browser.browserAction.setBadgeBackgroundColor({
			color: '#2ac3a2',
			tabId: activeTab.id,
		})
		await browser.browserAction.setBadgeText({
			text: '+',
			tabId: activeTab.id,
		})
		try {
			await addLink(activeTab.url)
		} catch (error) {
			await browser.browserAction.setBadgeBackgroundColor({
				color: '#c50042',
				tabId: activeTab.id,
			})
			await browser.browserAction.setBadgeText({
				text: 'X',
				tabId: activeTab.id,
			})
		} finally {
			await browser.browserAction.setBadgeText({
				text: '',
				tabId: activeTab.id,
			})
			await browser.browserAction.setBadgeBackgroundColor({
				color: null,
				tabId: activeTab.id,
			})
		}
	}
})
