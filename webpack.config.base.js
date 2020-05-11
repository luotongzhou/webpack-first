const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const webpack = require('webpack')
const path = require('path')
const isDev = process.env.NODE_ENV === 'development'
const config = require('./public/config')[isDev ? 'dev' : 'build']

module.exports = {
	mode: 'development',
	devtool: 'cheap-module-eval-source-map',
	entry: {
		index: './src/index.js',
		login: './src/login.jsx'
	},
	output: {
		path: path.resolve(__dirname, 'dist'), //必须是绝对路径
		filename: '[name].[hash:6].js',
		publicPath: isDev ? '/' : './' //通常是CDN地址
	},
	resolve: {
		modules: ['./src', 'node_modules'],
		alias: {
			'@': path.resolve(__dirname, 'src')
		},
		extensions: ['.js', 'json']
	},
	externals: {
		//jquery通过script引入之后，全局中即有了 jQuery 变量
		jquery: 'jQuery'
	},
	optimization: {
		splitChunks: {
			//分割代码块
			cacheGroups: {
				vendor: {
					//第三方依赖
					priority: 1, //设置优先级，首先抽离第三方模块
					name: 'vendor',
					test: /node_modules/,
					chunks: 'initial',
					minSize: 0,
					minChunks: 1 //最少引入了1次
				},
				//缓存组
				common: {
					//公共模块
					chunks: 'initial',
					name: 'common',
					minSize: 100, //大小超过100个字节
					minChunks: 3 //最少引入了3次
				}
			}
		},
		runtimeChunk: {
			name: 'manifest'
		}
	},
	module: {
		noParse: /jquery|lodash/,
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
				use: [
					'thread-loader',
					'cache-loader',
					{
						loader: 'babel-loader',
						options: {
							presets: ['@babel/preset-env', '@babel/preset-react'],
							plugins: [
								[
									'@babel/plugin-transform-runtime',
									{
										corejs: {
											version: 3,
											proposals: true
										},
										version: '^7.9.6' //babel-runtime version
									}
								]
							]
						}
					}
				],
				include: [path.resolve(__dirname, 'src')],
				exclude: /node_modules/ //排除 node_modules 目录
			},
			{
				test: /\.(le|c)ss$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: isDev
							? {
									hmr: isDev,
									reloadAll: true
							  }
							: {
									publicPath: '../'
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
			chunks: ['index'],
			minify: {
				removeAttributeQuotes: false, //是否删除属性的双引号
				collapseWhitespace: false //是否折叠空白
			}
			// hash: true //是否加上hash，默认是 false
		}),
		new HtmlWebpackPlugin({
			template: './public/login.html',
			filename: 'login.html', //打包后的文件名
			chunks: ['login'],
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
				},
				{
					from: 'common/*',
					to: path.resolve(__dirname, 'dist', 'common'),
					flatten: true
				}
				//还可以继续配置其它要拷贝的文件
			],
			{
				ignore: ['other.js']
			}
		),
		new MiniCssExtractPlugin({
			filename: 'css/[name].css'
			//个人习惯将css文件放在单独目录下
			// publicPath:'../'   //如果你的output的publicPath配置的是 './' 这种相对路径，那么如果将css文件放在单独目录下，记得在这里指定一下publicPath
		}),
		new OptimizeCssPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new HardSourceWebpackPlugin(),
		new webpack.DllReferencePlugin({
			manifest: path.resolve(__dirname, 'dist', 'dll', 'manifest.json')
		}),
		//忽略 moment 下的 ./locale 目录
		new webpack.IgnorePlugin(/\.\/locale/, /moment/)
	]
}
