import { zip } from 'zip-a-folder'
import { version } from '../../package.json'
import type { TargetBrowser } from './types.d.ts'

async function zipSourceFiles(outPath: string) {
	const SOURCE_GLOBS = [
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
		'vite.config.ts',
	]
	await zip(SOURCE_GLOBS.join(', '), outPath)
}

export async function zipRelease(targetBrowser: TargetBrowser) {
	await zip('dist', `release-${version}-${targetBrowser}.zip`)
}

export async function zipSources(targetBrowser: TargetBrowser) {
	await zipSourceFiles(`sources-${version}-${targetBrowser}.zip`)
}
