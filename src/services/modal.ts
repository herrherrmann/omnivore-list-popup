type ModalId = 'labels-modal'

let currentModal: null | ModalId = null

/**
 * Shows a modal with the specified DOM element id.
 */
export function showModal(shownModalId: ModalId) {
	currentModal = shownModalId
	const overlay = document.getElementById(shownModalId)!
	overlay.style.display = 'flex'
	overlay.addEventListener('click', closeModalViaOverlay)
	overlay.setAttribute('aria-hidden', 'false')
	const closeButton = overlay.querySelector('.modal-close-button')!
	closeButton.addEventListener('click', closeCurrentModal)
}

function closeModalViaOverlay(clickEvent: MouseEvent) {
	const clickTarget = clickEvent.target as HTMLElement
	if (clickTarget.id === currentModal) {
		closeModal(currentModal)
	}
	clickEvent.stopPropagation()
}

/**
 * Closes the currently-shown modal.
 */
function closeCurrentModal() {
	if (!currentModal) {
		return
	}
	closeModal(currentModal)
}

/**
 * Closes the modal with the specified DOM element id and removes all related event listeners.
 */
export function closeModal(modalId: ModalId) {
	const overlay = document.getElementById(modalId)!
	overlay.style.display = 'none'
	overlay.setAttribute('aria-hidden', 'true')
	overlay.removeEventListener('click', closeModalViaOverlay)
	const closeButton = overlay.querySelector('.modal-close-button')!
	closeButton.removeEventListener('click', closeCurrentModal)
	currentModal = null
}
