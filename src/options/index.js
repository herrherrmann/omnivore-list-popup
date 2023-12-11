import { loadSetting, saveSetting } from '../services/storage'

const apiUrlInputSelector = '#api-url'
const apiKeyInputSelector = '#api-key'
const searchQueryInputSelector = '#search-query'

async function restoreOptions() {
	await restoreInput('apiUrl', apiUrlInputSelector)
	const apiKey = await restoreInput('apiKey', apiKeyInputSelector)
	validateInput(apiKey, apiKeyInputSelector)
	await restoreInput('searchQuery', searchQueryInputSelector)
}

async function restoreInput(settingKey, inputSelector) {
	const settingValue = (await loadSetting(settingKey)) || ''
	const input = document.querySelector(inputSelector)
	input.value = settingValue
	return settingValue
}

function validateInput(settingValue, inputSelector) {
	const isValid = !!settingValue
	const input = document.querySelector(inputSelector)
	input.className = isValid ? 'valid' : ''
}

async function saveOptions(event) {
	event.preventDefault()
	const apiKey = document.querySelector(apiKeyInputSelector).value
	await saveSetting('apiKey', apiKey)
	validateInput(apiKey, apiKeyInputSelector)
	const searchQuery = document.querySelector(searchQueryInputSelector).value
	await saveSetting('searchQuery', searchQuery)
	const messageElement = document.querySelector('#message')
	messageElement.classList.add('success')
	messageElement.textContent = 'Saved!'
	setTimeout(() => {
		messageElement.textContent = ''
		messageElement.classList.remove('success')
	}, 1_000)
}

document.addEventListener('DOMContentLoaded', restoreOptions)
document.querySelector('form').addEventListener('submit', saveOptions)
