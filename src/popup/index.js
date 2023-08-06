const API_URL = 'https://api-prod.omnivore.app/api/graphql'

const searchQuery = `
query Search($after: String, $first: Int, $query: String) {
	search(first: $first, after: $after, query: $query) {
		... on SearchSuccess {
			edges {
				cursor
				node {
					id
					title
					slug
					url
					pageType
					contentReader
					createdAt
					isArchived
					readingProgressPercent
					readingProgressTopPercent
					readingProgressAnchorIndex
					author
					image
					description
					publishedAt
					ownedByViewer
					originalArticleUrl
					uploadFileId
					labels {
						id
						name
						color
					}
					pageId
					shortId
					quote
					annotation
					state
					siteName
					subscription
					readAt
					savedAt
					wordsCount
					recommendations {
						id
						name
						note
						user {
							userId
							name
							username
							profileImageURL
						}
						recommendedAt
					}
					highlights {
						...HighlightFields
					}
				}
			}
			pageInfo {
				hasNextPage
				hasPreviousPage
				startCursor
				endCursor
				totalCount
			}
		}
		... on SearchError {
			errorCodes
		}
	}
}
fragment HighlightFields on Highlight {
	id
	type
	shortId
	quote
	prefix
	suffix
	patch
	annotation
	createdByMe
	createdAt
	updatedAt
	sharedAt
	highlightPositionPercent
	highlightPositionAnchorIndex
	labels {
		id
		name
		color
		createdAt
	}
}`

async function loadApiKey() {
	function onGot(result) {
		return Promise.resolve(result.apiKey)
	}

	function onError(error) {
		return Promise.reject(error)
	}

	const getting = browser.storage.sync.get('apiKey')
	return getting.then(onGot, onError)
}

async function getActiveTab() {
	function onGot(tabs) {
		const activeTab = tabs[0]
		return Promise.resolve(activeTab)
	}
	function onError(error) {
		return Promise.reject(error)
	}
	const querying = browser.tabs.query({ active: true, currentWindow: true })
	return querying.then(onGot, onError)
}

async function sendAPIRequest(query, variables) {
	const apiKey = await loadApiKey()
	if (!apiKey) {
		// TODO: Show hint about missing API key.
		return
	}
	const response = await fetch(API_URL, {
		body: JSON.stringify({ query, variables }),
		headers: {
			Authorization: apiKey,
			'Content-Type': 'application/json',
		},
		method: 'POST',
	})
	const graphQLResult = await response.json()
	return graphQLResult.data
}

async function loadItems() {
	const data = await sendAPIRequest(searchQuery, { first: 10 })
	const edges = data.search.edges
	return edges
}

async function addLink(url) {
	const query = `
mutation SaveUrl($input: SaveUrlInput!) {
	saveUrl(input: $input) {
		... on SaveSuccess {
			url
			clientRequestId
		}
		... on SaveError {
			errorCodes
			message
		}
	}
}`
	const uuid = self.crypto.randomUUID()
	const variables = {
		input: {
			url,
			source: 'api',
			clientRequestId: uuid,
		},
	}
	// TODO: Error handling!
	await sendAPIRequest(query, variables)
}

async function initialize() {
	await reloadItems()
}

function showLoadingState() {
	const loadingContainer = document.getElementById('loading')
	loadingContainer.style = 'display: flex;'
}

function hideLoadingState() {
	const loadingContainer = document.getElementById('loading')
	loadingContainer.style = 'display: none;'
}

async function reloadItems() {
	showLoadingState()
	const content = document.getElementById('content')
	content.textContent = ''
	const list = document.createElement('ul')
	const items = await loadItems()
	items.forEach((item) => {
		const listItem = document.createElement('li')
		const itemNode = buildItemNode(item.node)
		listItem.appendChild(itemNode)
		list.appendChild(listItem)
	})
	content.appendChild(list)
	hideLoadingState()
}

function buildItemNode(node) {
	const item = document.createElement('a')
	item.className = 'item'
	const image = document.createElement(node.image ? 'img' : 'div')
	image.className = 'image'
	if (node.image) {
		image.src = node.image
	} else {
		image.innerText = node.title.substring(0, 1)
		image.style = `background-color: #${node.id.substring(0, 6)};`
	}
	const textDiv = document.createElement('div')
	textDiv.className = 'text'
	const title = document.createElement('div')
	title.className = 'title'
	title.textContent = node.title || '(No title)'
	textDiv.appendChild(title)
	const url = document.createElement('div')
	url.className = 'url'
	url.textContent = node.url
	textDiv.appendChild(url)
	item.appendChild(image)
	item.appendChild(textDiv)
	item.setAttribute('href', node.url)
	item.addEventListener('click', (event) => {
		event.preventDefault()
		browser.tabs.create({ url: node.url })
		if (!event.metaKey) {
			window.close()
		}
	})
	return item
}

document.addEventListener('DOMContentLoaded', initialize)

document.addEventListener('click', async (event) => {
	const element = event.target
	if (element.tagName !== 'BUTTON') {
		return
	}
	element.disabled = true
	if (element.classList.contains('add-current-page')) {
		const activeTab = await getActiveTab()
		await addLink(activeTab.url)
		await reloadItems()
	}
	if (element.classList.contains('refresh')) {
		const icon = element.querySelector('svg')
		icon.classList.add('rotating')
		await reloadItems()
		icon.classList.remove('rotating')
	}
	if (element.classList.contains('open-omnivore')) {
		browser.tabs.create({ url: 'https://omnivore.app/' })
		window.close()
	}
	element.removeAttribute('disabled')
	event.preventDefault()
})
