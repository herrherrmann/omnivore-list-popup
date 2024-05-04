import {
	SettingKey,
	defaultSettings,
	loadSetting,
	saveSetting,
} from './services/storage.ts'

const apiUrlInputSelector = '#api-url'
const apiKeyInputSelector = '#api-key'
const searchQueryInputSelector = '#search-query'

async function initialize() {
	await restoreInput('apiUrl', apiUrlInputSelector)
	const apiKey = await restoreInput('apiKey', apiKeyInputSelector)
	validateInput(apiKey, apiKeyInputSelector)
	await restoreInput('searchQuery', searchQueryInputSelector)
}

function getInput(selector: string) {
	return document.querySelector<HTMLInputElement>(selector)!
}

async function restoreInput(settingKey: SettingKey, inputSelector: string) {
	const settingValue = (await loadSetting(settingKey)) || ''
	const input = getInput(inputSelector)
	input.value = settingValue
	return settingValue
}

function validateInput(settingValue: string, inputSelector: string) {
	const isValid = !!settingValue
	const input = getInput(inputSelector)
	input.className = isValid ? 'valid' : ''
}

async function saveOptions(event: SubmitEvent) {
	event.preventDefault()
	const apiUrl = getInput(apiUrlInputSelector)!.value
	await saveSetting('apiUrl', apiUrl)
	const apiKey = getInput(apiKeyInputSelector)!.value
	await saveSetting('apiKey', apiKey)
	validateInput(apiKey, apiKeyInputSelector)
	const searchQuery = getInput(searchQueryInputSelector).value
	await saveSetting('searchQuery', searchQuery)
	const messageElement = document.querySelector('#message')!
	messageElement.classList.add('success')
	messageElement.textContent = 'Saved!'
	setTimeout(() => {
		messageElement.textContent = ''
		messageElement.classList.remove('success')
	}, 2_000)
}

document.addEventListener('DOMContentLoaded', initialize)
document
	.querySelector<HTMLFormElement>('form')!
	.addEventListener('submit', saveOptions)

document.addEventListener('click', async (event) => {
	const element = event.target as HTMLElement
	if (element.tagName !== 'BUTTON') {
		return
	}
	if (element.classList.contains('restore-defaults')) {
		const searchQueryInput = getInput(searchQueryInputSelector)
		searchQueryInput.value = defaultSettings.searchQuery
		const apiUrlInput = getInput(apiUrlInputSelector)
		apiUrlInput.value = defaultSettings.apiUrl
	}
})
