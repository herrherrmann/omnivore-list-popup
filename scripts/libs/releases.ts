import viteConfig from '../../vite.config.mts'
import type { TargetBrowser } from './types.d.ts'
import { zipRelease, zipSources } from './zip-files.ts'

export async function createReleases() {
	/* eslint-disable no-console */
	const vite = await import('vite')
	const targetBrowsers: TargetBrowser[] = ['firefox', 'chrome']
	for (const targetBrowser of targetBrowsers) {
		console.log(`⏳ Creating release for ${targetBrowser} ...`)
		try {
			await vite.build(viteConfig)
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
