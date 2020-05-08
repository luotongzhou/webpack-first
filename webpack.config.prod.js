const { smart } = require('webpack-merge')
const base = require('./webpack.config.base')
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const smp = new SpeedMeasurePlugin()

const webpack = require('webpack')

const config = smart(base, {
	mode: 'production',
	devtool: 'source-map',
	plugins: [
		new webpack.DefinePlugin({
			DEV: JSON.stringify('prod'), //字符串
			FLAG: 'true' //FLAG 是个布尔类型
		}),
		new BundleAnalyzerPlugin()
	]
})

module.exports = smp.wrap(config)
