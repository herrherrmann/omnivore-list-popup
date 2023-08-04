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

async function loadItems() {
	const apiKey = await loadApiKey()
	if (!apiKey) {
		// TODO: Show hint about missing API key.
		return
	}
	const response = await fetch(API_URL, {
		body: JSON.stringify({
			query: searchQuery,
			variables: {
				first: 10,
			},
		}),
		headers: {
			Authorization: apiKey,
			'Content-Type': 'application/json',
		},
		method: 'POST',
	})
	const graphQLResult = await response.json()
	const { data } = graphQLResult
	const edges = data.search.edges
	return edges
}

async function initialize() {
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
