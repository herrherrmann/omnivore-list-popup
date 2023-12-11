import browser from 'webextension-polyfill'
import { addLink, loadItems, loadLabels } from '../services/api'
import { loadSetting } from '../services/storage'
import { getActiveTab, openTab } from '../services/tabs'
import { buildItemNode } from './ui'

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

async function reloadItems() {
	const apiKey = await loadSetting('apiKey')
	if (!apiKey) {
		showState('api-key-missing')
		return
	}
	hideState('api-key-missing')
	hideState('no-items')
	hideState('error')
	showState('loading')
	const content = document.getElementById('content')
	content.textContent = ''
	try {
		const labels = await loadLabels()
		const items = await loadItems()
		if (items.length) {
			const list = document.createElement('ul')
			items.forEach((item) => {
				const listItem = document.createElement('li')
				const itemNode = buildItemNode(item.node, reloadItems, labels)
				listItem.appendChild(itemNode)
				list.appendChild(listItem)
			})
			content.appendChild(list)
		} else {
			showState('no-items')
		}
		hideState('loading')
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
	element.removeAttribute('disabled')
	event.preventDefault()
})
