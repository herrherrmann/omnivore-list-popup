import archiveSvg from '../images/archive.svg'
import tagSvg from '../images/tag.svg'
import { archiveLink, saveLabels } from '../services/api'
import { isMacOS } from '../services/system'
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
		if (!shouldKeepPopupOpen(event)) {
			window.close()
		}
	})
	return item
}

function shouldKeepPopupOpen(event) {
	const modifierKey = isMacOS() ? 'metaKey' : 'ctrlKey'
	return event[modifierKey]
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
	if (node.labels != null) {
		const labelsList = createLabelsList(node.labels)
		textDiv.appendChild(labelsList)
	}
	return textDiv
}

function createLabelsList(labels) {
	const container = document.createElement('div')
	const list = document.createElement('ul')
	list.className = 'listHorizontal'
	container.appendChild(list)
	labels.forEach((item) => {
		const listItem = document.createElement('li')
		listItem.textContent = item.name
		listItem.className = 'listLabel'
		listItem.style = 'background: ' + item.color + ';'
		list.appendChild(listItem)
	})
	return container
}

function createButtonsDiv(node, onReloadItems, labels) {
	const buttons = document.createElement('div')
	buttons.className = 'buttons'

	const labelButton = document.createElement('button')
	labelButton.type = 'button'
	labelButton.className = 'button label'
	labelButton.innerHTML = tagSvg
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
		div.className = 'label'

		const checkbox = document.createElement('input')
		checkbox.type = 'checkbox'
		checkbox.name = 'label'
		checkbox.value = item.id
		checkbox.id = item.id
		checkbox.checked = !!article.labels?.find((label) => label.id === item.id)
		div.appendChild(checkbox)

		const label = document.createElement('label')
		label.htmlFor = item.id
		label.innerHTML = item.name
		div.appendChild(label)

		labelsDiv.appendChild(div)
	})

	const buttons = labelsPage.querySelector('#buttons')
	buttons.innerHTML = ''

	const backButton = document.createElement('button')
	backButton.type = 'button'
	backButton.innerHTML = 'Back'
	backButton.addEventListener('click', () => {
		closeLabelsPage()
	})
	buttons.appendChild(backButton)

	let isSaving = false

	const saveButton = document.createElement('button')
	saveButton.type = 'submit'
	saveButton.innerHTML = 'Save'
	saveButton.addEventListener('click', async () => {
		if (isSaving) {
			return
		}
		isSaving = true
		saveButton.disabled = true
		backButton.disabled = true
		const inputElements = labelsPage.querySelectorAll('#labels input')
		const checkedValues = Array.from(inputElements)
			.filter((inputElement) => inputElement.checked)
			.map((inputElement) => inputElement.value)
		await saveLabels(article.id, checkedValues)
		// TODO: Error handling!
		closeLabelsPage()
		await onReloadItems()
	})
	buttons.appendChild(saveButton)

	function closeLabelsPage() {
		labelsPage.style = 'display: none;'
		labelsDiv.innerHTML = ''
		content.style = 'display: block;'
	}
}
