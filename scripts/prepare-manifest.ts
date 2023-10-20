import fs from 'fs/promises'
import manifestChrome from '../src/manifest.chrome.json'
import manifestCommon from '../src/manifest.common.json'
import manifestFirefox from '../src/manifest.firefox.json'

type Target = 'firefox' | 'chrome'

async function prepareManifest() {
	const target = getTarget()
	if (!target) {
		console.error(
			'No target parameter specified! Please specify -firefox or -chrome',
		)
		return
	}
	const manifests: Record<Target, object> = {
		chrome: manifestChrome,
		firefox: manifestFirefox,
	}
	const mergedManifest = {
		...manifestCommon,
		...manifests[target],
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

function getTarget(): Target | null {
	const isFirefox = process.argv.indexOf('-firefox') > -1
	if (isFirefox) {
		return 'firefox'
	}
	const isChrome = process.argv.indexOf('-chrome') > -1
	if (isChrome) {
		return 'chrome'
	}
	return null
}

prepareManifest()
