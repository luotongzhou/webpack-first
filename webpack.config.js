const HtmlWebpackPlugin = require("html-webpack-plugin")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const path = require("path")
const isDev = process.env.NODE_ENV === "development"
const config = require("./public/config")[isDev ? "dev" : "build"]

module.exports = {
	mode: isDev ? "development" : "production",
	devtool: "cheap-module-eval-source-map",
	entry: "./src/index.js",
	output: {
		path: path.resolve(__dirname, "dist"), //必须是绝对路径
		filename: "bundle.[hash:6].js",
		publicPath: "/", //通常是CDN地址
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
						loader: "url-loader",
						options: {
							outputPath: "assets",
							limit: 10240, //10K
							esModule: false,
							name: "[name]_[hash:6].[ext]",
						},
					},
				],
				exclude: /node_modules/,
			},
			{
				test: /\.jsx?$/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-env"],
						plugins: [
							[
								"@babel/plugin-transform-runtime",
								{
									corejs: 3,
								},
							],
						],
					},
				},
				exclude: /node_modules/, //排除 node_modules 目录
			},
			{
				test: /\.(le|c)ss$/,
				use: [
					"style-loader",
					"css-loader",
					{
						loader: "postcss-loader",
						options: {
              ident: 'postcss',
							plugins: () => [
								require("postcss-flexbugs-fixes"),
								require("postcss-preset-env")({
									autoprefixer: {
										overrideBrowserslist: [">0.25%", "not dead"],
										flexbox: "no-2009",
									},
									stage: 3,
								}),
							],
						},
					},
					"less-loader",
				],
				exclude: /node_modules/,
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "./public/index.html",
			filename: "index.html", //打包后的文件名
			config: config.template,
			minify: {
				removeAttributeQuotes: false, //是否删除属性的双引号
				collapseWhitespace: false, //是否折叠空白
			},
			// hash: true //是否加上hash，默认是 false
		}),
		new CleanWebpackPlugin({
			cleanOnceBeforeBuildPatterns: ["**/*", "!dll", "!dll/**"], //不删除dll目录下的文件
		}),
	],
	devServer: {
		port: "3000", //默认是8080
		quiet: false, //默认不启用
		inline: true, //默认开启 inline 模式，如果设置为false,开启 iframe 模式
		stats: "errors-only", //终端仅打印 error
		overlay: false, //默认不启用
		clientLogLevel: "silent", //日志等级
		compress: true, //是否启用 gzip 压缩
	},
}
