/**
 * Created by SWSD on 2018-11-19.
 */
var path = require('path'),
    webpack = require('webpack'),
    MiniCssExtractPlugin = require('mini-css-extract-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin'),
    CleanWebpackPlugin = require('clean-webpack-plugin');
var  fs = require('fs');
var rootPath = path.resolve(__dirname, '.'), // 项目根目录
    src = path.join(rootPath, 'src'), // 开发源码目录
    env = process.env.NODE_ENV.trim(); // 当前环境
var commonPath = {
    rootPath: rootPath,
    dist: path.join(rootPath, 'dist'), // build 后输出目录
    staticDir: path.join(rootPath, 'static') // 无需处理的静态资源目录
};
const devtool=false;
var webpackConfig = {
    mode:env,
    name:'client',
    entry:{
        vendor:['react','react-dom','redux','immutable'],
        main:path.join(src, '/entry/index.js')
    },
    output: {
        path: path.join(commonPath.dist, 'static'),
        publicPath:'./',
        filename:'[name].[chunkhash:6].js',
        chunkFilename:'[id].[chunkhash:6].js',
    },
    devtool:devtool,
    resolve: {
        //定义资源的默认后缀名
        extensions: ['.js', '.jsx', '.scss', '.json', '.css'],
        alias: {
            // ================================
            // 自定义路径别名
            // ================================
            ASSETS: path.join(src, 'assets'),
            COMMON: path.join(src, 'common'),
            COMPONENT: path.join(src, 'components'),
            REDUX: path.join(src, 'redux'),
            REDUCER: path.join(src, 'redux/reducers'),
            ACTION: path.join(src, 'redux/actions'),
            STATIC: commonPath.staticDir,
        },
        //设置默认搜索的目录名
        modules: [
            rootPath,
            "node_modules"
        ]
    },
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            use:[
                {
                    loader:'babel-loader',
                    options:{
                        cacheDirectory: true,
                    }
                }],
            include: src,
            exclude: /(node_modules|bower_components)/,
        }, {
            test: /\.(png|jpe?g|gif|svg)$/,
            loader: 'url-loader',
            query: {
                limit: 10240, // 10KB 以下使用 base64
                name: 'img/[name]-[hash:6].[ext]'
            }
        }, {
            test: /\.(woff2?|eot|ttf|otf)$/,
            loader: 'url-loader?limit=10240&name=fonts/[name]-[hash:6].[ext]'
        },{
            test: /\.(sa|sc|c)ss$/,
            use: [
                MiniCssExtractPlugin.loader,
                'css-loader',
                'postcss-loader',
                'sass-loader',
            ],
        }]
    },
    externals: {},//排除打包的插件放这里，webpack将不对其进行打包,
    optimization:{
        runtimeChunk: {
            name: 'manifest'
        },
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendor",
                    priority: -20,
                    chunks: 'all'
                },
            }
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            template: path.join(src, '/views/index.ejs'),
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
            },
        }),
        new CleanWebpackPlugin('dist', {
            root: commonPath.rootPath,
            verbose: false
        }),
        new CopyWebpackPlugin([ // 复制高度静态资源
            {
                context:commonPath.staticDir,
                from: '**/*',
                // to:path.resolve(__dirname, '../dist/static')
                ignore: ['*.md']
            }
        ]),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new webpack.optimize.AggressiveMergingPlugin(),
        new webpack.optimize.MinChunkSizePlugin({
            minChunkSize: 30000
        }),
        new MiniCssExtractPlugin({
            filename:  '[name].[contenthash:6].css',
            chunkFilename: '[name].[contenthash:6].css',
        }),
    ]
};
    webpack(webpackConfig, function (err, stats) {
        // show build info to console
        console.log(stats.toString({chunks: false, color: true}));
        // save build info to file
        fs.writeFile(
            path.join(commonPath.dist, '__build_info__'),
            stats.toString({color: false})
        );
    });


