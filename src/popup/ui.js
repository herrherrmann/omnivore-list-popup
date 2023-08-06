import { openTab } from '../services/tabs'

export function buildItemNode(node) {
	const item = document.createElement('a')
	item.className = 'item'
	item.appendChild(createImage(node))
	item.appendChild(createTextDiv(node))
	item.setAttribute('href', node.url)
	item.addEventListener('click', (event) => {
		event.preventDefault()
		openTab(node.url)
		if (!event.metaKey) {
			window.close()
		}
	})
	return item
}

function createImage(node) {
	const image = document.createElement(node.image ? 'img' : 'div')
	image.className = 'image'
	if (node.image) {
		image.src = node.image
	} else {
		image.innerText = node.title.substring(0, 1)
		const randomColor = node.id.substring(0, 6)
		image.style = `background-color: #${randomColor};`
	}
	return image
}

function createTextDiv(node) {
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
	return textDiv
}
