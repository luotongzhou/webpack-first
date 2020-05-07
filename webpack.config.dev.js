const path = require('path')
const { smart } = require('webpack-merge')
const base = require('./webpack.config.base')
const apiMocker = require('mocker-api')

const webpack = require('webpack')

module.exports = smart(base, {
	mode: 'development',
	devServer: {
		port: '3000', //默认是8080
		quiet: false, //默认不启用
		inline: true, //默认开启 inline 模式，如果设置为false,开启 iframe 模式
		stats: 'errors-only', //终端仅打印 error
		overlay: false, //默认不启用
		clientLogLevel: 'silent', //日志等级
		compress: true, //是否启用 gzip 压缩
		hot: true,
		proxy: {
			// '/api': {
			// 	target: 'http://localhost:4000',
			// 	pathRewrite: {
			// 		'/api': ''
			// 	}
			// },
		},
		before(app) {
			// app.get('/user', (req, res) => {
			// 	res.json({ name: '罗同舟' })
			// })
			apiMocker(app, path.resolve(__dirname, './mock/mock.js'))
		}
	},
	plugins: [
		new webpack.DefinePlugin({
			DEV: JSON.stringify('dev'), //字符串
			FLAG: 'true' //FLAG 是个布尔类型
		})
	]
})
