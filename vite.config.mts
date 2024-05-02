import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
	build: {
		rollupOptions: {
			input: {
				popup: resolve(__dirname, 'src/popup.html'),
				options: resolve(__dirname, 'src/options.html'),
				background: resolve(__dirname, 'src/background/index.js'),
			},
			output: {
				format: 'es',
				inlineDynamicImports: false,
				chunkFileNames: '[name].[hash].js',
				entryFileNames: '[name].js',
				dir: 'dist',
			},
		},
	},
})
