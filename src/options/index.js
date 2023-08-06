import { loadApiKey, saveApiKey } from '../services/storage'

const apiKeyFieldSelector = '#api-key'

async function restoreOptions() {
	const apiKey = await loadApiKey()
	document.querySelector(apiKeyFieldSelector).value = apiKey || ''
}

async function saveOptions(event) {
	event.preventDefault()
	const apiKey = document.querySelector(apiKeyFieldSelector).value
	await saveApiKey(apiKey)
	const messageElement = document.querySelector('#message')
	messageElement.classList.add('success')
	messageElement.textContent = 'Saved!'
}

document.addEventListener('DOMContentLoaded', restoreOptions)
document.querySelector('form').addEventListener('submit', saveOptions)
