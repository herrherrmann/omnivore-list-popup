const apiKeyFieldSelector = '#api-key'

function saveOptions(event) {
	event.preventDefault()
	browser.storage.sync.set({
		apiKey: document.querySelector(apiKeyFieldSelector).value,
	})
}

function restoreOptions() {
	function setCurrentChoice(result) {
		document.querySelector(apiKeyFieldSelector).value = result.apiKey || ''
	}

	function onError(error) {
		console.log(`Error: ${error}`)
	}

	const getting = browser.storage.sync.get('apiKey')
	getting.then(setCurrentChoice, onError)
}

document.addEventListener('DOMContentLoaded', restoreOptions)
document.querySelector('form').addEventListener('submit', saveOptions)
