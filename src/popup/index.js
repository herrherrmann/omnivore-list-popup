import { addLink, loadItems } from '../services/api'

async function getActiveTab() {
	function onGot(tabs) {
		const activeTab = tabs[0]
		return Promise.resolve(activeTab)
	}
	function onError(error) {
		return Promise.reject(error)
	}
	const querying = browser.tabs.query({ active: true, currentWindow: true })
	return querying.then(onGot, onError)
}

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
		const itemNode = buildItemNode(item.node)
		listItem.appendChild(itemNode)
		list.appendChild(listItem)
	})
	content.appendChild(list)
	hideLoadingState()
}

function buildItemNode(node) {
	const item = document.createElement('a')
	item.className = 'item'
	const image = document.createElement(node.image ? 'img' : 'div')
	image.className = 'image'
	if (node.image) {
		image.src = node.image
	} else {
		image.innerText = node.title.substring(0, 1)
		image.style = `background-color: #${node.id.substring(0, 6)};`
	}
	const textDiv = document.createElement('div')
	textDiv.className = 'text'
	const title = document.createElement('div')
	title.className = 'title'
	title.textContent = node.title || '(No title)'
	textDiv.appendChild(title)
	const url = document.createElement('div')
	url.className = 'url'
	url.textContent = node.url
	textDiv.appendChild(url)
	item.appendChild(image)
	item.appendChild(textDiv)
	item.setAttribute('href', node.url)
	item.addEventListener('click', (event) => {
		event.preventDefault()
		browser.tabs.create({ url: node.url })
		if (!event.metaKey) {
			window.close()
		}
	})
	return item
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
		browser.tabs.create({ url: 'https://omnivore.app/' })
		window.close()
	}
	element.removeAttribute('disabled')
	event.preventDefault()
})
