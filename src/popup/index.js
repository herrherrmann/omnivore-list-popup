import { addLink, loadItems } from '../services/api'
import { getActiveTab, openTab } from '../services/tabs'
import { buildItemNode } from './ui'

async function initialize() {
	await reloadItems()
}

function showLoadingState() {
	const loadingContainer = document.getElementById('loading')
	loadingContainer.style = 'display: flex;'
}

function hideLoadingState() {
	const loadingContainer = document.getElementById('loading')
	loadingContainer.style = 'display: none;'
}

async function reloadItems() {
	showLoadingState()
	const content = document.getElementById('content')
	content.textContent = ''
	const list = document.createElement('ul')
	const items = await loadItems()
	items.forEach((item) => {
		const listItem = document.createElement('li')
		const itemNode = buildItemNode(item.node, reloadItems)
		listItem.appendChild(itemNode)
		list.appendChild(listItem)
	})
	content.appendChild(list)
	hideLoadingState()
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
	element.removeAttribute('disabled')
	event.preventDefault()
})
