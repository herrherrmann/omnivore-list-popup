import { loadSetting } from './storage'

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
	const apiKey = await loadSetting('apiKey')
	const apiUrl = await loadSetting('apiUrl')
	if (!apiKey || !apiUrl) {
		return
	}
	const response = await fetch(apiUrl, {
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
	const query = await loadSetting('searchQuery')
	const data = await sendAPIRequest(searchQuery, {
		first: 10,
		query: query,
	})
	const edges = data.search.edges
	return edges
}

function generateUUID() {
	return self.crypto.randomUUID()
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
	const variables = {
		input: {
			url,
			source: 'api',
			clientRequestId: generateUUID(),
		},
	}
	// TODO: Error handling!
	await sendAPIRequest(query, variables)
}

export async function archiveLink(linkId) {
	const query = `
        mutation SetLinkArchived($input: ArchiveLinkInput!) {
            setLinkArchived(input: $input) {
                ... on ArchiveLinkSuccess {
                    linkId
                    message
                }
                ... on ArchiveLinkError {
                    message
                    errorCodes
                }
            }
        }`
	const variables = {
		input: {
			archived: true,
			linkId,
		},
	}
	// TODO: Error handling!
	await sendAPIRequest(query, variables)
}

export async function loadLabels() {
	const query = `
            query GetLabels { 
                labels {
                    ... on LabelsSuccess {
                    labels {
                        ...LabelFields
                    }
                    }
                    ... on LabelsError {
                    errorCodes
                    }
                }
            }
            fragment LabelFields on Label {
                id
                name
                color
                description
                createdAt
            }`

	const data = await sendAPIRequest(query)
	const labels = data.labels.labels
	return labels
}

export async function saveLabels(pageId, labelIds) {
	const query = `
        mutation SetLabels($input: SetLabelsInput!) {
            setLabels(input: $input) {
                ... on SetLabelsSuccess {
                    labels {
                        ...LabelFields
                    }
                }
                ... on SetLabelsError {
                    errorCodes
                }
            }
        }
        fragment LabelFields on Label {
            id
            name
            color
            description
            createdAt
            position
            internal
        }`
	const variables = {
		input: {
			pageId,
			labelIds,
		},
	}
	await sendAPIRequest(query, variables)
}
