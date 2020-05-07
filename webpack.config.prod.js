const { smart } = require('webpack-merge')
const base = require('./webpack.config.base')

const webpack = require('webpack')

module.exports = smart(base, {
	mode: 'production',
	devtool: 'source-map',
	plugins: [
		new webpack.DefinePlugin({
			DEV: JSON.stringify('prod'), //字符串
			FLAG: 'true' //FLAG 是个布尔类型
		})
	]
})
