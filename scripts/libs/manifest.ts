import fs from 'fs/promises'
import manifestChrome from '../../src/manifest.chrome.json'
import manifestCommon from '../../src/manifest.common.json'
import manifestFirefox from '../../src/manifest.firefox.json'
import { TargetBrowser } from './types'

export async function prepareManifest(targetBrowser: TargetBrowser | null) {
	if (!targetBrowser) {
		console.error(
			'No target browser specified! Please specify "firefox" or "chrome".',
		)
		return
	}
	const manifests: Record<TargetBrowser, object> = {
		chrome: manifestChrome,
		firefox: manifestFirefox,
	}
	const mergedManifest = {
		...manifestCommon,
		...manifests[targetBrowser],
	}
	try {
		await fs.writeFile(
			'./manifest.json',
			JSON.stringify(mergedManifest, undefined, 4),
		)
	} catch (error) {
		console.error('Error while writing manifest: ', error)
	}
}
