const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const webpack = require('webpack')
const path = require('path')
const isDev = process.env.NODE_ENV === 'development'
const config = require('./public/config')[isDev ? 'dev' : 'build']

module.exports = {
	mode: isDev ? 'development' : 'production',
	devtool: 'cheap-module-eval-source-map',
	entry: {
		index: './src/index.js',
		login: './src/login.js'
	},
	output: {
		path: path.resolve(__dirname, 'dist'), //必须是绝对路径
		filename: 'bundle.[hash:6].js'
		// publicPath: "./", //通常是CDN地址
	},
	module: {
		rules: [
			// {
			// 	test: /.html$/,
			// 	use: "html-withimg-loader",
			// },
			{
				test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							outputPath: 'assets',
							limit: 10240, //10K
							esModule: false,
							name: '[name]_[hash:6].[ext]'
						}
					}
				],
				exclude: /node_modules/
			},
			{
				test: /\.jsx?$/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
						plugins: [
							[
								'@babel/plugin-transform-runtime',
								{
									corejs: 3
								}
							]
						]
					}
				},
				exclude: /node_modules/ //排除 node_modules 目录
			},
			{
				test: /\.(le|c)ss$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							hmr: isDev,
							reloadAll: true
						}
					},
					'css-loader',
					{
						loader: 'postcss-loader',
						options: {
							ident: 'postcss',
							plugins: () => [require('autoprefixer')()]
						}
					},
					'less-loader'
				],
				exclude: /node_modules/
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './public/index.html',
			filename: 'index.html', //打包后的文件名
			config: config.template,
			minify: {
				removeAttributeQuotes: false, //是否删除属性的双引号
				collapseWhitespace: false //是否折叠空白
			}
			// hash: true //是否加上hash，默认是 false
		}),
		new HtmlWebpackPlugin({
			template: './public/login.html',
			filename: 'login.html', //打包后的文件名
			minify: {
				removeAttributeQuotes: false, //是否删除属性的双引号
				collapseWhitespace: false //是否折叠空白
			}
		}),
		new CleanWebpackPlugin({
			cleanOnceBeforeBuildPatterns: ['**/*', '!dll', '!dll/**'] //不删除dll目录下的文件
		}),
		new CopyWebpackPlugin(
			[
				{
					from: 'public/js/*.js',
					to: path.resolve(__dirname, 'dist', 'js'),
					flatten: true
				}
				//还可以继续配置其它要拷贝的文件
			],
			{
				ignore: ['other.js']
			}
		),
		new MiniCssExtractPlugin({
			filename: '[name].css'
			//个人习惯将css文件放在单独目录下
			// publicPath:'./'   //如果你的output的publicPath配置的是 './' 这种相对路径，那么如果将css文件放在单独目录下，记得在这里指定一下publicPath
		}),
		new OptimizeCssPlugin(),
		new webpack.HotModuleReplacementPlugin()
	],
	devServer: {
		port: '3000', //默认是8080
		quiet: false, //默认不启用
		inline: true, //默认开启 inline 模式，如果设置为false,开启 iframe 模式
		stats: 'errors-only', //终端仅打印 error
		overlay: false, //默认不启用
		clientLogLevel: 'silent', //日志等级
		compress: true, //是否启用 gzip 压缩
		hot: true
	}
}
