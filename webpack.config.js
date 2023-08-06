const path = require('path')

/** @type { import('webpack').Configuration } */
module.exports = {
	module: {
		rules: [
			{
				test: /\.svg/,
				use: {
					loader: 'svg-inline-loader',
					options: {},
				},
			},
		],
	},
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
