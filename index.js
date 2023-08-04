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

async function reloadItems() {
	const list = document.createElement('ul')
	const items = await loadItems()
	items.forEach((item) => {
		const listItem = document.createElement('li')
		const link = buildLink(item.node)
		listItem.appendChild(link)
		list.appendChild(listItem)
	})
	const content = document.getElementById('content')
	content.textContent = ''
	content.appendChild(list)
}

function buildLink(node) {
	const link = document.createElement('a')
	const title = document.createElement('div')
	title.className = 'title'
	title.textContent = node.title || '(No title)'
	link.appendChild(title)
	const url = document.createElement('div')
	url.className = 'url'
	url.textContent = node.url
	link.appendChild(url)
	link.setAttribute('href', node.url)
	link.addEventListener('click', (event) => {
		event.preventDefault()
		browser.tabs.create({ url: node.url })
		window.close()
	})
	return link
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
		await reloadItems()
	}
	if (element.classList.contains('open-omnivore')) {
		browser.tabs.create({ url: 'https://omnivore.app/' })
		window.close()
	}
	element.removeAttribute('disabled')
	event.preventDefault()
})
