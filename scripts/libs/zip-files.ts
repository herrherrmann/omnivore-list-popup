import archiver from 'archiver'
import fs from 'fs'
import { version } from '../../package.json'
import type { TargetBrowser } from './types.d.ts'

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

const RELEASE_FILES = ['dist']

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
	'LICENSE',
	'package-lock.json',
	'package.json',
	'README.md',
	'tsconfig.json',
	'vite.config.mts',
]

export async function zipRelease(targetBrowser: TargetBrowser) {
	await zipFiles(RELEASE_FILES, `release-${version}-${targetBrowser}.zip`)
}

export async function zipSources(targetBrowser: TargetBrowser) {
	await zipFiles(SOURCE_FILES, `sources-${version}-${targetBrowser}.zip`)
}
