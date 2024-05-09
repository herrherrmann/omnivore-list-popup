const apiQueries = {
	search: `
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
        }`,
	saveUrl: `
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
        }`,
	getLabels: `
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
        }`,
	setLabels: `
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
        }`,
	setLinkArchived: `
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
        }`,
}

export default apiQueries
