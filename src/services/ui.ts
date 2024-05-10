import Color from 'colorjs.io'
import archiveRestoreSvg from '../../public/images/archive-restore.svg?raw'
import archiveSvg from '../../public/images/archive.svg?raw'
import chevronLeftSvg from '../../public/images/chevron-left.svg?raw'
import chevronRightSvg from '../../public/images/chevron-right.svg?raw'
import tagSvg from '../../public/images/tag.svg?raw'
import trash2Svg from '../../public/images/trash-2.svg?raw'
import {
	OmnivoreLabel,
	OmnivoreNode,
	OmnivorePageInfo,
} from '../omnivoreTypes.ts'
import {
	archiveLink,
	deleteLink,
	pageSize,
	saveLabels,
	unarchiveLink,
} from './api.ts'
import { closeModal, showModal } from './modal.ts'
import { isMacOS } from './system.ts'
import { openTab } from './tabs.ts'
import { UiOptions } from './storage.ts'

type StateId = 'api-key-missing' | 'no-items' | 'error' | 'content' | 'loading'

/**
 * Shows a certain UI state (similar to a page).
 */
export function showState(shownStateId: StateId) {
	const stateIds: StateId[] = [
		'api-key-missing',
		'no-items',
		'error',
		'content',
		'loading',
	]
	stateIds.forEach((stateId) => {
		const isNewState = stateId === shownStateId
		const element = document.getElementById(stateId)!
		element.style.display = isNewState ? 'flex' : 'none'
	})
}

export function setLoadingState(isLoading: boolean) {
	const refreshButton = document.getElementById(
		'refresh-button',
	) as HTMLButtonElement
	const icon = refreshButton.querySelector('svg')!
	if (isLoading) {
		refreshButton.disabled = true
		icon.classList.add('rotating')
	} else {
		refreshButton.removeAttribute('disabled')
		icon.classList.remove('rotating')
	}
}

/**
 *
 * @param node Omnivore’s item node.
 * @param labels list of all labels from Omnivore (for the label edit screen)
 * @param onAfterUpdate function to be called after an item has been updated (e.g. archived or labeled)
 * @returns HTML node representing an Omnivore entry in an HTML list.
 */
export function buildItemNode(
	node: OmnivoreNode,
	labels: OmnivoreLabel[],
	uiOptions: UiOptions,
	onAfterUpdate: () => void,
): HTMLAnchorElement {
	const item = document.createElement('a')
	item.className = 'item'
	item.appendChild(createImage(node))
	item.appendChild(createTextDiv(node))
	item.appendChild(createButtonsDiv(node, labels, uiOptions, onAfterUpdate))
	item.setAttribute('href', node.url)
	item.addEventListener('click', (event) => {
		event.preventDefault()
		openTab(node.url, !shouldKeepPopupOpen(event))
		if (!shouldKeepPopupOpen(event)) {
			window.close()
		}
	})
	return item
}

function shouldKeepPopupOpen(event: MouseEvent) {
	const modifierKey = isMacOS() ? 'metaKey' : 'ctrlKey'
	return event[modifierKey]
}

function createImage(node: OmnivoreNode) {
	if (node.image) {
		const img = document.createElement('img')
		img.className = 'image'
		img.onerror = () => {
			const fallbackDiv = getFallbackDiv(node)
			img.replaceWith(fallbackDiv)
		}
		img.src = node.image
		return img
	}
	return getFallbackDiv(node)
}

function getFallbackDiv(node: OmnivoreNode) {
	const div = document.createElement('div')
	div.className = 'image'
	div.innerText = node.title.substring(0, 1)
	const backgroundColor = `#${node.id.substring(0, 6)}`
	const textColor = getContrastingColor(backgroundColor)
	div.style.backgroundColor = backgroundColor
	div.style.color = textColor
	return div
}

function getContrastingColor(colorString: string) {
	const color = new Color(colorString)
	// @ts-expect-error color.contrast() type is missing from 3rd-party library.
	const onWhite = Math.abs(color.contrast('white', 'WCAG21'))
	// @ts-expect-error color.contrast() type is missing from 3rd-party library.
	const onBlack = Math.abs(color.contrast('black', 'WCAG21'))
	const contrastingColor = onWhite > onBlack ? 'white' : 'black'
	return contrastingColor
}

function createTextDiv(node: OmnivoreNode) {
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

function createLabelsList(labels: OmnivoreLabel[]) {
	const list = document.createElement('ul')
	list.className = 'labels'
	labels.forEach((item) => {
		const listItem = document.createElement('li')
		listItem.className = 'label'
		const dot = document.createElement('span')
		dot.className = 'dot'
		dot.style.background = item.color
		listItem.appendChild(dot)
		const name = document.createElement('span')
		name.textContent = item.name
		listItem.appendChild(name)
		list.appendChild(listItem)
	})
	return list
}

function createButtonsDiv(
	node: OmnivoreNode,
	labels: OmnivoreLabel[],
	uiOptions: UiOptions,
	onAfterUpdate: () => void,
) {
	const buttons = document.createElement('div')
	buttons.className = 'buttons'
	if (uiOptions.showLabelsButton) {
		const labelButton = document.createElement('button')
		labelButton.type = 'button'
		labelButton.className = 'button label'
		labelButton.innerHTML = tagSvg
		labelButton.title = 'Set labels'
		labelButton.addEventListener('click', async (event) => {
			event.preventDefault()
			event.stopPropagation()
			showLabelsModal(node, labels, onAfterUpdate)
		})
		buttons.appendChild(labelButton)
	}
	if (uiOptions.showArchiveButton) {
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
				onAfterUpdate()
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
				onAfterUpdate()
			})
			buttons.appendChild(restoreButton)
		}
	}
	if (uiOptions.showDeleteButton) {
		const deleteButton = document.createElement('button')
		deleteButton.type = 'button'
		deleteButton.className = 'button'
		deleteButton.innerHTML = trash2Svg
		deleteButton.title = 'Delete this item'
		deleteButton.addEventListener('click', async (event) => {
			event.preventDefault()
			event.stopPropagation()
			await deleteLink(node.id)
			onAfterUpdate()
		})
		buttons.appendChild(deleteButton)
	}
	return buttons
}

export function createPagination(pageInfo: OmnivorePageInfo) {
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

function showLabelsModal(
	article: OmnivoreNode,
	labels: OmnivoreLabel[],
	onAfterUpdate: () => void,
) {
	showModal('labels-modal')
	const labelsModal = document.getElementById('labels-modal')!

	const labelsDiv = labelsModal.querySelector('#labels')!
	labelsDiv.innerHTML = ''

	labels.forEach((item) => {
		const div = document.createElement('div')
		div.className = 'label'

		const checkbox = document.createElement('input')
		checkbox.type = 'checkbox'
		checkbox.name = 'label'
		checkbox.value = item.id
		checkbox.id = item.id
		checkbox.checked = !!article.labels?.find(
			(label: OmnivoreLabel) => label.id === item.id,
		)
		checkbox.style.accentColor = item.color
		div.appendChild(checkbox)

		const label = createLabel(item)
		div.appendChild(label)

		labelsDiv.appendChild(div)
	})

	const buttons = labelsModal.querySelector('#buttons')!
	buttons.innerHTML = ''

	const cancelButton = document.createElement('button')
	cancelButton.type = 'button'
	cancelButton.className = 'button'
	cancelButton.textContent = 'Cancel'
	cancelButton.addEventListener('click', closeLabelsModal)
	buttons.appendChild(cancelButton)

	let isSaving = false

	const saveButton = document.createElement('button')
	saveButton.type = 'submit'
	saveButton.className = 'button'
	saveButton.textContent = 'Save'
	saveButton.addEventListener('click', async () => {
		if (isSaving) {
			return
		}
		isSaving = true
		saveButton.disabled = true
		cancelButton.disabled = true
		const inputElements =
			labelsModal.querySelectorAll<HTMLInputElement>('#labels input')
		const checkedValues = Array.from(inputElements)
			.filter((inputElement) => inputElement.checked)
			.map((inputElement) => inputElement.value)
		await saveLabels(article.id, checkedValues)
		// TODO: Error handling!
		closeLabelsModal()
		onAfterUpdate()
	})
	buttons.appendChild(saveButton)

	function closeLabelsModal() {
		closeModal('labels-modal')
	}
}

function createLabel(label: OmnivoreLabel) {
	const labelElement = document.createElement('label')
	labelElement.htmlFor = label.id
	const dot = document.createElement('span')
	dot.className = 'dot'
	dot.style.background = label.color
	labelElement.appendChild(dot)
	const name = document.createElement('span')
	name.className = 'name'
	name.textContent = label.name
	labelElement.appendChild(name)
	return labelElement
}
