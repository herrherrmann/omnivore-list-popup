import { openTab } from '../services/tabs'

export function buildItemNode(node) {
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
		openTab(node.url)
		if (!event.metaKey) {
			window.close()
		}
	})
	return item
}
