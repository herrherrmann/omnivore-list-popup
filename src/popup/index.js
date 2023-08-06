import { addLink, loadItems } from '../services/api'
import { loadApiKey } from '../services/storage'
import { getActiveTab, openTab } from '../services/tabs'
import { buildItemNode } from './ui'

async function initialize() {
	await reloadItems()
}

function showError(message) {
	const error = document.getElementById('error')
	error.innerText = message
	error.style = 'display: flex;'
}

function resetError() {
	const error = document.getElementById('error')
	error.innerText = ''
	error.style = 'display: none;'
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
	const apiKey = await loadApiKey()
	if (!apiKey) {
		showError('No API key found! Please check the extension settings.')
		return
	}
	resetError()
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
