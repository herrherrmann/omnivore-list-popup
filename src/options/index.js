import { loadApiKey, saveApiKey } from '../services/storage'

const apiKeyInputSelector = '#api-key'

async function restoreOptions() {
	const apiKey = await loadApiKey()
	const apiKeyInput = document.querySelector(apiKeyInputSelector)
	apiKeyInput.value = apiKey || ''
	validateInput(apiKey)
}

async function saveOptions(event) {
	event.preventDefault()
	const apiKey = document.querySelector(apiKeyInputSelector).value
	await saveApiKey(apiKey)
	validateInput(apiKey)
	const messageElement = document.querySelector('#message')
	messageElement.classList.add('success')
	messageElement.textContent = 'Saved!'
	setTimeout(() => {
		messageElement.textContent = ''
		messageElement.classList.remove('success')
	}, 1_000)
}

function validateInput(apiKeyValue) {
	const isValid = !!apiKeyValue
	const apiKeyInput = document.querySelector(apiKeyInputSelector)
	apiKeyInput.className = isValid ? 'valid' : ''
}

document.addEventListener('DOMContentLoaded', restoreOptions)
document.querySelector('form').addEventListener('submit', saveOptions)
