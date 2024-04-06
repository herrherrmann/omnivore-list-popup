import browser from 'webextension-polyfill'
import { addLink, loadItems, loadLabels } from '../services/api'
import { loadSetting } from '../services/storage'
import { getActiveTab, openTab } from '../services/tabs'
import { buildItemNode, createPagination, showState } from './ui'

async function initialize() {
	await reloadItems()
}

let currentPage = 1

async function reloadItems() {
	showState('loading')
	const apiKey = await loadSetting('apiKey')
	if (!apiKey) {
		showState('api-key-missing')
		return
	}
	const content = document.getElementById('content')
	content.textContent = ''
	try {
		const labels = await loadLabels()
		const { items, pageInfo } = await loadItems(currentPage)
		// Load previous page when archiving an article leads to an empty page.
		if (!items.length && currentPage > 1) {
			currentPage -= 1
			await reloadItems()
			return
		}
		if (!items.length) {
			showState('no-items')
			return
		}
		const list = document.createElement('ul')
		items.forEach((item) => {
			const listItem = document.createElement('li')
			const itemNode = buildItemNode(item.node, labels, reloadItems)
			listItem.appendChild(itemNode)
			list.appendChild(listItem)
		})
		content.appendChild(list)
		const pagination = createPagination(pageInfo)
		if (pagination) {
			content.appendChild(pagination)
		}
		showState('content')
	} catch (error) {
		showState('error')
	}
}

document.addEventListener('DOMContentLoaded', initialize)

document.addEventListener('click', async (event) => {
	const element = event.target
	if (element.tagName !== 'BUTTON') {
		return
	}
	element.disabled = true
	if (element.classList.contains('add-current-page')) {
		const activeTab = await getActiveTab()
		await addLink(activeTab.url)
		await reloadItems()
	}
	if (element.classList.contains('refresh')) {
		const icon = element.querySelector('svg')
		icon.classList.add('rotating')
		await reloadItems()
		icon.classList.remove('rotating')
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
