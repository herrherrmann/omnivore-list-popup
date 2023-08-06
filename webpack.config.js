const path = require('path')

/** @type { import('webpack').Configuration } */
module.exports = {
	entry: {
		options: './src/options/index.js',
		popup: './src/popup/index.js',
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname),
	},
	mode: 'production',
}
