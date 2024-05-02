import { prepareManifest } from './libs/manifest.ts'
import type { TargetBrowser } from './libs/types.d.ts'

function getTargetBrowserFromArgs(): TargetBrowser | null {
	const hasArg = (arg: string) => process.argv.indexOf(arg) > -1
	if (hasArg('-firefox')) {
		return 'firefox'
	}
	if (hasArg('-chrome')) {
		return 'chrome'
	}
	return null
}

prepareManifest(getTargetBrowserFromArgs())
