import webExtension from 'vite-plugin-web-extension'
import { prepareManifest } from './manifest.ts'
import type { TargetBrowser } from './types.d.ts'
import { zipRelease, zipSources } from './zip-files.ts'

async function runVite() {
	const vite = await import('vite')
	await vite.build({
		plugins: [
			webExtension({
				browser: 'firefox',
				disableAutoLaunch: true,
			}),
		],
	})
}

export async function createReleases() {
	const targetBrowsers: TargetBrowser[] = ['firefox', 'chrome']
	for (const targetBrowser of targetBrowsers) {
		console.log(`⏳ Creating release for ${targetBrowser} ...`)
		try {
			await prepareManifest(targetBrowser)
			await runVite()
			await zipRelease(targetBrowser)
			if (targetBrowser === 'firefox') {
				await zipSources(targetBrowser)
			}
		} catch (error) {
			console.error(
				`❌ Error while creating release for ${targetBrowser}: `,
				error,
			)
		}
		console.log(`✅ Release for ${targetBrowser} created!`)
	}
}
