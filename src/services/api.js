import { defaultSettings, loadSetting } from './storage'

const searchQuery = `
    query Search($after: String, $first: Int, $query: String) {
        search(first: $first, after: $after, query: $query) {
            ... on SearchSuccess {
                edges {
                    cursor
                    node {
                        id
                        title
                        url
                        pageType
                        contentReader
                        isArchived
                        author
                        image
                        originalArticleUrl
                        labels {
                            id
                            name
                            color
                        }
                        state
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
    }`

const setLinkArchivedQuery = `
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

async function sendAPIRequest(query, variables) {
	const apiKey = await loadSetting('apiKey')
	const apiUrl = (await loadSetting('apiUrl')) || defaultSettings.apiUrl
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

export const pageSize = 20

export async function loadItems(page) {
	const query = await loadSetting('searchQuery')
	const variables = {
		// The "after" value requires a string instead of a number.
		after: page ? String((page - 1) * pageSize) : undefined,
		first: pageSize,
		query: query,
	}
	const data = await sendAPIRequest(searchQuery, variables)
	return {
		items: data.search.edges,
		pageInfo: data.search.pageInfo,
	}
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
	const variables = {
		input: {
			archived: true,
			linkId,
		},
	}
	// TODO: Error handling!
	await sendAPIRequest(setLinkArchivedQuery, variables)
}
export async function unarchiveLink(linkId) {
	const variables = {
		input: {
			archived: false,
			linkId,
		},
	}
	// TODO: Error handling!
	await sendAPIRequest(setLinkArchivedQuery, variables)
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
