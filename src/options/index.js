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
}

document.addEventListener('DOMContentLoaded', restoreOptions)
document.querySelector('form').addEventListener('submit', saveOptions)
