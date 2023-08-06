import { loadApiKey, saveApiKey } from '../services/storage'

const apiKeyFieldSelector = '#api-key'

async function restoreOptions() {
	const options = await loadApiKey()
	document.querySelector(apiKeyFieldSelector).value = options.apiKey || ''
}

async function saveOptions(event) {
	event.preventDefault()
	const apiKey = document.querySelector(apiKeyFieldSelector).value
	await saveApiKey(apiKey)
}

document.addEventListener('DOMContentLoaded', restoreOptions)
document.querySelector('form').addEventListener('submit', saveOptions)
