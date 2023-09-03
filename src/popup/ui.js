import archiveSvg from '../images/archive.svg'
import labelSvg from '../images/label.svg'
import { archiveLink, setLabel } from '../services/api'
import { openTab } from '../services/tabs'

export function buildItemNode(node, onReloadItems, labels) {
	const item = document.createElement('a')
	item.className = 'item'
	item.appendChild(createImage(node))
	item.appendChild(createTextDiv(node))
	item.appendChild(createButtonsDiv(node, onReloadItems, labels))
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

function createButtonsDiv(node, onReloadItems, labels) {
	const buttons = document.createElement('div')
	buttons.className = 'buttons'

	const labelButton = document.createElement('button')
	labelButton.type = 'button'
	labelButton.className = 'button label'
	labelButton.innerHTML = labelSvg
	labelButton.title = 'Set labels'
	labelButton.addEventListener('click', async (event) => {
		event.preventDefault()
		event.stopPropagation()
		showLabelsPage(node, labels, onReloadItems)
	})
	buttons.appendChild(labelButton)

	const archiveButton = document.createElement('button')
	archiveButton.type = 'button'
	archiveButton.className = 'button archive'
	archiveButton.innerHTML = archiveSvg
	archiveButton.title = 'Archive this item'
	archiveButton.addEventListener('click', async (event) => {
		event.preventDefault()
		event.stopPropagation()
		await archiveLink(node.id)
		await onReloadItems()
	})
	buttons.appendChild(archiveButton)
	return buttons
}

function showLabelsPage(article, labels, onReloadItems) {
	const content = document.getElementById('content')
	content.style = 'display: none;'

	const labelsPage = document.getElementById('labels-page')
	labelsPage.style = 'display: flex;'

	const labelsDiv = document.getElementById('labels')

	labels.forEach((item) => {
		const div = document.createElement('div')

		const checkbox = document.createElement('input')
		checkbox.name = 'checkboxLabel'
		checkbox.type = 'checkbox'
		checkbox.value = item.id
		checkbox.id = item.id

		const label = document.createElement('label')
		label.htmlFor = item.id
		label.appendChild(document.createTextNode(' ' + item.name))

		const isChecked = !!article.labels?.find((label) => label.id === item.id)
		checkbox.checked = isChecked

		div.appendChild(checkbox)
		div.appendChild(label)
		labelsDiv.appendChild(div)
	})

	const buttons = document.createElement('div')
	const backButton = document.createElement('button')
	backButton.type = 'button'
	backButton.className = 'close'
	backButton.innerHTML = 'Close'
	backButton.addEventListener('click', () => {
		closeLabelsPage()
	})
	buttons.appendChild(backButton)

	const saveButton = document.createElement('button')
	saveButton.style = 'margin-left: 10px;'
	saveButton.type = 'button'
	saveButton.className = 'save'
	saveButton.innerHTML = 'Save'
	saveButton.addEventListener('click', async () => {
		const inputElements = document.getElementsByName('checkboxLabel')
		const checkedValues = Array.from(inputElements)
			.filter((inputElement) => inputElement.checked)
			.map((inputElement) => inputElement.value)
		await setLabel(article.id, checkedValues)
		closeLabelsPage()
		await onReloadItems()
	})
	buttons.appendChild(saveButton)
	labelsDiv.appendChild(buttons)

	function closeLabelsPage() {
		labelsPage.style = 'display: none;'
		labelsDiv.innerHTML = ''
		content.style = 'display: block;'
	}
}
