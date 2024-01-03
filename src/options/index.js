import { defaultSettings, loadSetting, saveSetting } from '../services/storage'

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
	const apiUrl = document.querySelector(apiUrlInputSelector).value
	await saveSetting('apiUrl', apiUrl)
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
	}, 2_000)
}

document.addEventListener('DOMContentLoaded', restoreOptions)
document.querySelector('form').addEventListener('submit', saveOptions)

document.addEventListener('click', async (event) => {
	const element = event.target
	if (element.tagName !== 'BUTTON') {
		return
	}
	if (element.classList.contains('restore-defaults')) {
		const searchQueryInput = document.querySelector(searchQueryInputSelector)
		searchQueryInput.value = defaultSettings.searchQuery
		const apiUrlInput = document.querySelector(apiUrlInputSelector)
		apiUrlInput.value = defaultSettings.apiUrl
	}
})
