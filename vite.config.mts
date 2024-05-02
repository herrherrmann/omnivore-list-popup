import { defineConfig } from 'vite'
import webExtension from 'vite-plugin-web-extension'

export default defineConfig({
	plugins: [
		webExtension({
			browser: 'firefox',
		}),
	],
})
