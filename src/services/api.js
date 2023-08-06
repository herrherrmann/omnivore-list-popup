import { loadApiKey } from './storage'

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

export async function loadItems() {
	const data = await sendAPIRequest(searchQuery, { first: 10 })
	const edges = data.search.edges
	return edges
}

export async function addLink(url) {
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