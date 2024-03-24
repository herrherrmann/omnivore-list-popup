import archiver from 'archiver'
import fs from 'fs'
import { version } from '../../src/manifest.common.json'
import { TargetBrowser } from './types'

function zipFiles(sourceGlobs: string[], outPath: string) {
	const archive = archiver('zip', { zlib: { level: 9 } })
	const stream = fs.createWriteStream(outPath)

	return new Promise((resolve, reject) => {
		sourceGlobs.forEach((glob) => {
			archive.glob(glob)
		})
		archive.on('error', (err) => reject(err)).pipe(stream)

		stream.on('close', () => resolve(null))
		archive.finalize()
	})
}

const RELEASE_FILES = [
	'icons/**',
	'background.js',
	'LICENSE',
	'manifest.json',
	'options.css',
	'options.html',
	'options.js',
	'popup.css',
	'popup.html',
	'popup.js',
	'variables.css',
]

const SOURCE_FILES = [
	...RELEASE_FILES,
	'docs/**',
	'scripts/**',
	'src/**',
	'.eslintignore',
	'.eslintrc.json',
	'.gitignore',
	'.nvmrc',
	'.prettierignore',
	'.prettierrc',
	'.stylelintrc.json',
	'CHANGELOG.md',
	'package-lock.json',
	'package.json',
	'README.md',
	'tsconfig.json',
	'webpack.config.js',
]

export async function zipRelease(targetBrowser: TargetBrowser) {
	await zipFiles(RELEASE_FILES, `release-${version}-${targetBrowser}.zip`)
}

export async function zipSources(targetBrowser: TargetBrowser) {
	await zipFiles(SOURCE_FILES, `sources-${version}-${targetBrowser}.zip`)
}
