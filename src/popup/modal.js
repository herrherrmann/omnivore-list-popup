let currentModal = null

/**
 * Shows a modal with the specified DOM element id.
 * @param {('labels-modal')} shownModalId
 */
export function showModal(shownModalId) {
	currentModal = shownModalId
	const overlay = document.getElementById(shownModalId)
	overlay.style = 'display: flex;'
	overlay.addEventListener('click', closeModalViaOverlay)
	overlay.setAttribute('aria-hidden', false)
	const closeButton = overlay.querySelector('.modal-close-button')
	closeButton.addEventListener('click', closeCurrentModal)
}

/**
 * @param {Event} clickEvent
 */
function closeModalViaOverlay(clickEvent) {
	if (clickEvent.target.id === currentModal) {
		closeModal(currentModal)
	}
	clickEvent.stopPropagation()
}

/**
 * Closes the currently-shown modal.
 */
function closeCurrentModal() {
	closeModal(currentModal)
}

/**
 * Closes the modal with the specified DOM element id and removes all related event listeners.
 * @param {('labels-modal')} modalId
 */
export function closeModal(modalId) {
	const overlay = document.getElementById(modalId)
	overlay.style = 'display: none'
	overlay.setAttribute('aria-hidden', true)
	overlay.removeEventListener('click', closeModalViaOverlay)
	const closeButton = overlay.querySelector('.modal-close-button')
	closeButton.removeEventListener('click', closeCurrentModal)
	currentModal = null
}
