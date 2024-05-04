import browser from 'webextension-polyfill'
import {
	OmnivoreLabel,
	OmnivoreNode,
	OmnivorePageInfo,
} from './omnivoreTypes.ts'
import { addLink, loadItems, loadLabels } from './services/api.ts'
import { loadLocal, loadSetting, saveLocal } from './services/storage.ts'
import { getActiveTab, openTab } from './services/tabs.ts'
import {
	buildItemNode,
	createPagination,
	setLoadingState,
	showState,
} from './services/ui.ts'

let currentPage = 1

async function initialize() {
	currentPage = 1
	showState('loading')
	await reloadItems()
}

async function reloadItems() {
	const apiKey = await loadSetting('apiKey')
	if (!apiKey) {
		showState('api-key-missing')
		return
	}
	try {
		setLoadingState(true)
		// Only the first page (the initial popup state) should be cached.
		const useCache = currentPage === 1
		if (useCache) {
			const cache = await loadLocal('apiCache')
			if (cache) {
				const { items, pageInfo, labels } = cache
				renderItems(items, pageInfo, labels)
			}
		}
		const { items, pageInfo } = await loadItems(currentPage)
		const labels = await loadLabels()
		// Load previous page when archiving an article leads to an empty page.
		if (!items.length && currentPage > 1) {
			currentPage -= 1
			await reloadItems()
			return
		}
		renderItems(items, pageInfo, labels)
		// Cache API responses.
		if (useCache) {
			await saveLocal('apiCache', { items, pageInfo, labels })
		}
	} catch (error) {
		showState('error')
	} finally {
		setLoadingState(false)
	}
}

function renderItems(
	items: OmnivoreNode[],
	pageInfo: OmnivorePageInfo,
	labels: OmnivoreLabel[],
) {
	if (!items.length) {
		showState('no-items')
		return
	}
	const newContent = document.createElement('div')
	newContent.className = 'content'
	newContent.id = 'content'
	const list = document.createElement('ul')
	items.forEach((item) => {
		const listItem = document.createElement('li')
		const itemNode = buildItemNode(item.node, labels, reloadItems)
		listItem.appendChild(itemNode)
		list.appendChild(listItem)
	})
	newContent.appendChild(list)
	const pagination = createPagination(pageInfo)
	if (pagination) {
		newContent.appendChild(pagination)
	}
	const content = document.getElementById('content')!
	content.replaceWith(newContent)
	showState('content')
}

document.addEventListener('DOMContentLoaded', initialize)

document.addEventListener('click', async (event) => {
	const element = event.target as HTMLButtonElement
	if (element.tagName !== 'BUTTON') {
		return
	}
	element.disabled = true
	if (element.classList.contains('add-current-page')) {
		const activeTab = await getActiveTab()
		try {
			if (!activeTab.url) {
				throw Error('No tab url')
			}
			await addLink(activeTab.url)
		} catch (error) {
			// TODO: Indicate error in UI.
		} finally {
			await reloadItems()
		}
	}
	if (element.classList.contains('refresh')) {
		setLoadingState(true)
		await reloadItems()
		setLoadingState(false)
	}
	if (element.classList.contains('open-omnivore')) {
		openTab('https://omnivore.app/')
		window.close()
	}
	if (element.classList.contains('open-settings')) {
		browser.runtime.openOptionsPage()
		window.close()
	}
	if (element.classList.contains('previous-page')) {
		currentPage -= 1
		await reloadItems()
	}
	if (element.classList.contains('next-page')) {
		currentPage += 1
		await reloadItems()
	}
	element.removeAttribute('disabled')
	event.preventDefault()
})
