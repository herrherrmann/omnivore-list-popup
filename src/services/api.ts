import apiQueries from './apiQueries.ts'
import { defaultSettings, loadSetting } from './storage.ts'

async function sendAPIRequest(query: string, variables?: object) {
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

export async function loadItems(page: number) {
	const query = await loadSetting('searchQuery')
	const variables = {
		// The "after" value requires a string instead of a number.
		after: page ? String((page - 1) * pageSize) : undefined,
		first: pageSize,
		query: query,
	}
	const data = await sendAPIRequest(apiQueries.search, variables)
	return {
		items: data.search.edges,
		pageInfo: data.search.pageInfo,
	}
}

function generateUUID() {
	return self.crypto.randomUUID()
}

export async function addLink(url: string) {
	const variables = {
		input: {
			url,
			source: 'api',
			clientRequestId: generateUUID(),
		},
	}
	const response = await sendAPIRequest(apiQueries.saveUrl, variables)
	if (hasResponseError(response.saveUrl)) {
		throw new Error('adding link failed')
	}
	return response
}

function hasResponseError(responseBody: { errorCodes?: string[] }) {
	return (responseBody.errorCodes || []).length > 0
}

export async function archiveLink(linkId: string) {
	const variables = {
		input: {
			archived: true,
			linkId,
		},
	}
	// TODO: Error handling!
	await sendAPIRequest(apiQueries.setLinkArchived, variables)
}
export async function unarchiveLink(linkId: string) {
	const variables = {
		input: {
			archived: false,
			linkId,
		},
	}
	// TODO: Error handling!
	await sendAPIRequest(apiQueries.setLinkArchived, variables)
}

export async function loadLabels() {
	const data = await sendAPIRequest(apiQueries.getLabels)
	const labels = data.labels.labels
	return labels
}

export async function saveLabels(pageId: string, labelIds: string[]) {
	const variables = {
		input: {
			pageId,
			labelIds,
		},
	}
	await sendAPIRequest(apiQueries.setLabels, variables)
}
