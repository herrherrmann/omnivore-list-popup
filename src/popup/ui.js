import archiveRestoreSvg from '../images/archive-restore.svg'
import archiveSvg from '../images/archive.svg'
import chevronLeftSvg from '../images/chevron-left.svg'
import chevronRightSvg from '../images/chevron-right.svg'
import tagSvg from '../images/tag.svg'
import {
	archiveLink,
	pageSize,
	saveLabels,
	unarchiveLink,
} from '../services/api'
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
	const list = document.createElement('ul')
	list.className = 'labels'
	labels.forEach((item) => {
		const listItem = document.createElement('li')
		listItem.className = 'label'
		const dot = document.createElement('span')
		dot.className = 'dot'
		dot.style = 'background: ' + item.color
		listItem.appendChild(dot)
		const name = document.createElement('span')
		name.textContent = item.name
		listItem.appendChild(name)
		list.appendChild(listItem)
	})
	return list
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

	if (!node.isArchived) {
		const archiveButton = document.createElement('button')
		archiveButton.type = 'button'
		archiveButton.className = 'button'
		archiveButton.innerHTML = archiveSvg
		archiveButton.title = 'Archive this item'
		archiveButton.addEventListener('click', async (event) => {
			event.preventDefault()
			event.stopPropagation()
			await archiveLink(node.id)
			await onReloadItems()
		})
		buttons.appendChild(archiveButton)
	} else {
		const restoreButton = document.createElement('button')
		restoreButton.type = 'button'
		restoreButton.className = 'button'
		restoreButton.innerHTML = archiveRestoreSvg
		restoreButton.title = 'Restore this item'
		restoreButton.addEventListener('click', async (event) => {
			event.preventDefault()
			event.stopPropagation()
			await unarchiveLink(node.id)
			await onReloadItems()
		})
		buttons.appendChild(restoreButton)
	}
	return buttons
}

export function createPagination(pageInfo) {
	// pagInfo.hasPreviousPage is always false(?), so we’re calculating this manually.
	const hasPreviousPage =
		pageInfo.startCursor && Number(pageInfo.startCursor) > 0
	if (!pageInfo.hasNextPage && !hasPreviousPage) {
		return null
	}
	const pagination = document.createElement('div')
	pagination.className = 'pagination'
	const currentPage = Math.ceil(pageInfo.endCursor / pageSize)
	const totalPages = Math.ceil(pageInfo.totalCount / pageSize)
	const info = document.createElement('div')
	info.className = 'info'
	info.innerText = `${currentPage} / ${totalPages}`
	const buttons = document.createElement('div')
	buttons.className = 'buttons'
	if (hasPreviousPage) {
		const previousButton = document.createElement('button')
		previousButton.type = 'button'
		previousButton.className = 'button previous-page'
		previousButton.innerHTML = chevronLeftSvg
		previousButton.title = 'Go to previous page'
		buttons.appendChild(previousButton)
	}
	buttons.appendChild(info)
	if (pageInfo.hasNextPage) {
		const nextButton = document.createElement('button')
		nextButton.type = 'button'
		nextButton.className = 'button next-page'
		nextButton.innerHTML = chevronRightSvg
		nextButton.title = 'Go to next page'
		buttons.appendChild(nextButton)
	}
	pagination.appendChild(buttons)
	return pagination
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
		const dot = document.createElement('span')
		dot.className = 'dot'
		dot.style = 'background: ' + item.color
		label.appendChild(dot)
		const name = document.createElement('span')
		name.className = 'name'
		name.textContent = item.name
		label.appendChild(name)
		div.appendChild(label)

		labelsDiv.appendChild(div)
	})

	const buttons = labelsPage.querySelector('#buttons')
	buttons.innerHTML = ''

	const backButton = document.createElement('button')
	backButton.type = 'button'
	backButton.textContent = 'Back'
	backButton.addEventListener('click', () => {
		closeLabelsPage()
	})
	buttons.appendChild(backButton)

	let isSaving = false

	const saveButton = document.createElement('button')
	saveButton.type = 'submit'
	saveButton.textContent = 'Save'
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
