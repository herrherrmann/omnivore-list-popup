import viteConfig from '../vite.config.ts'
import type { TargetBrowser } from './libs/types.d.ts'
import { zipRelease, zipSources } from './libs/zip-files.ts'

async function createReleases() {
	/* eslint-disable no-console */
	const vite = await import('vite')
	const targetBrowser = process.env.TARGET as TargetBrowser
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
	/* eslint-enable no-console */
}

createReleases()
