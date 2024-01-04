import webpack from 'webpack'
// @ts-ignore
import webpackConfig from '../webpack.config.js'
import { TargetBrowser, prepareManifest } from './prepare-manifest'
import { zipRelease, zipSources } from './zip-files'

async function runWebpack() {
	const promise = new Promise((resolve, reject) => {
		webpack(webpackConfig, (error, stats) => {
			if (error || stats?.hasErrors()) {
				reject(error || '(See errors in stats)')
			}
			resolve(null)
		})
	})
	return promise
}

async function createReleases() {
	const targetBrowsers: TargetBrowser[] = ['firefox', 'chrome']
	for (const targetBrowser of targetBrowsers) {
		console.log(`⏳ Creating release for ${targetBrowser} ...`)
		try {
			await prepareManifest(targetBrowser)
			await runWebpack()
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

createReleases()
