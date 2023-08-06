import swc from '@rollup/plugin-swc'

/** @type {import('rollup').RollupOptions} */
export default {
	input: {
		options: 'src/options/index.js',
		popup: 'src/popup/index.js',
	},
	output: {
		dir: '.',
		format: 'cjs',
	},
	plugins: [swc()],
}
