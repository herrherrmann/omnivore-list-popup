import browser from 'webextension-polyfill'
import { addLink, loadItems, loadLabels } from '../services/api'
import { loadSetting } from '../services/storage'
import { getActiveTab, openTab } from '../services/tabs'
import { buildItemNode, createPagination } from './ui'

async function initialize() {
	await reloadItems()
}

function showState(elementId) {
	const element = document.getElementById(elementId)
	element.style = 'display: flex;'
}

function hideState(elementId) {
	const element = document.getElementById(elementId)
	element.style = 'display: none;'
}

let currentPage = 1

async function reloadItems() {
	const apiKey = await loadSetting('apiKey')
	if (!apiKey) {
		showState('api-key-missing')
		return
	}
	hideState('api-key-missing')
	hideState('no-items')
	hideState('error')
	hideState('labels-page')
	hideState('content')
	showState('loading')
	const content = document.getElementById('content')
	content.textContent = ''
	try {
		const labels = await loadLabels()
		const { items, pageInfo } = await loadItems(currentPage)
		if (items.length) {
			const list = document.createElement('ul')
			items.forEach((item) => {
				const listItem = document.createElement('li')
				const itemNode = buildItemNode(item.node, reloadItems, labels)
				listItem.appendChild(itemNode)
				list.appendChild(listItem)
			})
			content.appendChild(list)
			const pagination = createPagination(pageInfo)
			if (pagination) {
				content.appendChild(pagination)
			}
		} else {
			showState('no-items')
		}
		hideState('loading')
		showState('content')
	} catch (error) {
		hideState('loading')
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
