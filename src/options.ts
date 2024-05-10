import {
	SettingKey,
	defaultSettings,
	loadSetting,
	saveSetting,
} from './services/storage.ts'

const inputSelectors = {
	apiUrl: '#api-url',
	apiKey: '#api-key',
	searchQuery: '#search-query',
}

async function initialize() {
	await restoreInput('apiUrl', inputSelectors.apiUrl)
	const apiKey = await restoreInput('apiKey', inputSelectors.apiKey)
	validateInput(apiKey, inputSelectors.apiKey)
	await restoreInput('searchQuery', inputSelectors.searchQuery)
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
	const apiUrl = getInput(inputSelectors.apiUrl).value
	await saveSetting('apiUrl', apiUrl)
	const apiKey = getInput(inputSelectors.apiKey).value
	await saveSetting('apiKey', apiKey)
	validateInput(apiKey, inputSelectors.apiKey)
	const searchQuery = getInput(inputSelectors.searchQuery).value
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
		const searchQueryInput = getInput(inputSelectors.searchQuery)
		searchQueryInput.value = defaultSettings.searchQuery
		const apiUrlInput = getInput(inputSelectors.apiUrl)
		apiUrlInput.value = defaultSettings.apiUrl
	}
})
