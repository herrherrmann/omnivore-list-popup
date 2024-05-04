import { defineConfig } from 'vite'
import webExtension, { readJsonFile } from 'vite-plugin-web-extension'

const targetToBrowsers: Record<string, string> = {
	chrome: 'chrome',
	vivaldi: 'chrome',
	firefox: 'firefox',
}

const target = process.env.TARGET || 'firefox'
const browser = targetToBrowsers[target]

export default defineConfig({
	plugins: [
		webExtension({
			browser,
			manifest: () => {
				const packageJSON = readJsonFile('./package.json')
				const manifestCommon = readJsonFile('./src/manifest.common.json')
				const manifestFirefox = readJsonFile('./src/manifest.firefox.json')
				const manifestChrome = readJsonFile('./src/manifest.chrome.json')
				return {
					...manifestCommon,
					...manifestFirefox,
					...manifestChrome,
					version: packageJSON.version,
				}
			},
			webExtConfig: {
				chromiumBinary:
					target === 'vivaldi'
						? '/Applications/Vivaldi.app/Contents/MacOS/Vivaldi'
						: undefined,
			},
		}),
	],
})
