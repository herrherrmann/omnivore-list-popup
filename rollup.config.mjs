import swc from '@rollup/plugin-swc'

/** @type {import('rollup').RollupOptions} */
export default {
	input: {
		options: 'src/options/index.ts',
		popup: 'src/popup/index.ts',
	},
	output: {
		dir: '.',
		format: 'cjs',
	},
	plugins: [swc()],
}
