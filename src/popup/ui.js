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
	labelButton.ariaLabel = 'Set Labels'
	labelButton.addEventListener('click', async (event) => {
		event.preventDefault()
		event.stopPropagation()
		loadLabelSelection(node, labels)
	})
	buttons.appendChild(labelButton)

	const archiveButton = document.createElement('button')
	archiveButton.type = 'button'
	archiveButton.className = 'button archive'
	archiveButton.innerHTML = archiveSvg
	archiveButton.ariaLabel = 'Archive this item'
	archiveButton.addEventListener('click', async (event) => {
		event.preventDefault()
		event.stopPropagation()
		await archiveLink(node.id)
		await onReloadItems()
	})
	buttons.appendChild(archiveButton)
	return buttons
}

function loadLabelSelection(article, labels) {
	const content = document.getElementById('content')
	content.style = 'display: none;'

	const labelPage = document.getElementById('labelPage')
	labelPage.style = 'display: flex;'

	const ckBoxContainer = document.getElementById('labelList')

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
		ckBoxContainer.appendChild(div)
	})

	const li = document.createElement('li')
	const backButton = document.createElement('button')
	backButton.type = 'button'
	backButton.className = 'closeLabelSelection'
	backButton.innerHTML = 'Close'
	backButton.addEventListener('click', async () => {
		//TODO: check bug of broken layout of the original page
		document.getElementById('content').style = 'display: flex;'
		labelPage.style = 'display: none;'
		ckBoxContainer.innerHTML = ''
	})
	li.appendChild(backButton)

	const saveButton = document.createElement('button')
	saveButton.style = 'margin-left: 10px;'
	saveButton.type = 'button'
	saveButton.className = 'saveLabelSelection'
	saveButton.innerHTML = 'Save'
	saveButton.addEventListener('click', async () => {
		const inputElements = document.getElementsByName('checkboxLabel')
		const checkedValues = Array.from(inputElements)
			.filter((inputElement) => inputElement.checked)
			.map((inputElement) => inputElement.value)

		await setLabel(article.id, checkedValues)

		//TODO: check bug of broken layout of the original page
		document.getElementById('content').style = 'display: flex;'
		labelPage.style = 'display: none;'
		ckBoxContainer.innerHTML = ''
	})
	li.appendChild(saveButton)
	ckBoxContainer.appendChild(li)
}
