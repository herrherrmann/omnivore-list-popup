import { defineConfig } from 'vite'
import webExtension, { readJsonFile } from 'vite-plugin-web-extension'

const target = process.env.TARGET || 'firefox'

export default defineConfig({
	plugins: [
		webExtension({
			browser: target,
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
		}),
	],
})
