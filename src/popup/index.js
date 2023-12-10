import browser from 'webextension-polyfill'
import { addLink, loadItems, loadLabels } from '../services/api'
import { loadSetting } from '../services/storage'
import { getActiveTab, openTab } from '../services/tabs'
import { buildItemNode } from './ui'

async function initialize() {
	await reloadItems()
}

function showApiKeyMissingPage() {
	const page = document.getElementById('api-key-missing')
	page.style = 'display: flex;'
}

function hideApiKeyMissingPage() {
	const page = document.getElementById('api-key-missing')
	page.style = 'display: none;'
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
	const apiKey = await loadSetting('apiKey')
	if (!apiKey) {
		showApiKeyMissingPage()
		return
	}
	hideApiKeyMissingPage()
	showLoadingState()
	const content = document.getElementById('content')
	content.textContent = ''
	const list = document.createElement('ul')
	const labels = await loadLabels()
	const items = await loadItems()
	items.forEach((item) => {
		const listItem = document.createElement('li')
		const itemNode = buildItemNode(item.node, reloadItems, labels)
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
	if (element.classList.contains('open-settings')) {
		browser.runtime.openOptionsPage()
		window.close()
	}
	element.removeAttribute('disabled')
	event.preventDefault()
})
