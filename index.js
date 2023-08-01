function initialize() {
	getCurrentWindowTabs().then((tabs) => {
		let tabsList = document.getElementById('tabs-list')
		let currentTabs = document.createDocumentFragment()
		let limit = 5
		let counter = 0

		tabsList.textContent = ''

		for (let tab of tabs) {
			if (!tab.active && counter <= limit) {
				let tabLink = document.createElement('a')

				tabLink.textContent = tab.title || tab.id
				tabLink.setAttribute('href', tab.id)
				tabLink.classList.add('switch-tabs')
				currentTabs.appendChild(tabLink)
			}

			counter += 1
		}

		tabsList.appendChild(currentTabs)
	})
}

document.addEventListener('DOMContentLoaded', initialize)

function getCurrentWindowTabs() {
	return browser.tabs.query({ currentWindow: true })
}

document.addEventListener('click', (e) => {
	function callOnActiveTab(callback) {
		getCurrentWindowTabs().then((tabs) => {
			for (let tab of tabs) {
				if (tab.active) {
					callback(tab, tabs)
				}
			}
		})
	}

	if (e.target.id === 'tabs-create') {
		browser.tabs.create({
			url: 'https://developer.mozilla.org/en-US/Add-ons/WebExtensions',
		})
	} else if (e.target.id === 'tabs-alertinfo') {
		callOnActiveTab((tab) => {
			let props = ''
			for (let item in tab) {
				props += `${item} = ${tab[item]} \n`
			}
			alert(props)
		})
	} else if (e.target.classList.contains('switch-tabs')) {
		let tabId = +e.target.getAttribute('href')

		browser.tabs.query({ currentWindow: true }).then((tabs) => {
			for (let tab of tabs) {
				if (tab.id === tabId) {
					browser.tabs.update(tabId, {
						active: true,
					})
				}
			}
		})
	}

	e.preventDefault()
})
