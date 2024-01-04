import { prepareManifest } from './libs/manifest'
import { TargetBrowser } from './libs/types'

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
