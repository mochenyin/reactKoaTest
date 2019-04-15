var path = require('path'),
    webpack = require('webpack'),
    MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpackDevMiddleware = require('koa-webpack-dev-middleware');
const webpackHotMiddleware = require('koa-webpack-hot-middleware');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
var rootPath = path.resolve(__dirname, '.'), // 项目根目录
    src = path.join(rootPath, 'src'), // 开发源码目录
    env = process.env.NODE_ENV.trim(); // 当前环境
const views = require('koa-views');
const enableLocalServerRender=true;
var commonPath = {
    rootPath: rootPath,
    viewHTML: path.join(src, enableLocalServerRender?'/views/index.ejs':'/views/index.html'),
    dist: path.join(rootPath, 'dist'), // build 后输出目录
    staticDir: path.join(rootPath, 'static') // 无需处理的静态资源目录
};
const {matchPath} =require('react-router-dom');
var webpackConfig = {
    target: 'node',
    mode:env,
    entry:[
        'eventsource-polyfill',
        'react-hot-loader/patch',
        path.join(src, '/entry/index.js')
    ],
    output: {
        path: path.join(commonPath.dist, 'static'),
        publicPath:'/',
        filename:'[name].js',
        chunkFilename:'[id].js',
    },
    devtool:'eval-source-map',
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
            test: /\.(sa|sc|c|le)ss$/,
            use: [
                'style-loader',
                'css-loader',
                'postcss-loader',
                'sass-loader',
                'less-loader'
            ],
        },{
            test: /\.(png|jpe?g|gif|svg)$/,
            loader: 'url-loader',
            query: {
                limit: 10240, // 10KB 以下使用 base64
                name: 'img/[name]-[hash:6].[ext]'
            }
        }, {
            test: /\.(woff2?|eot|ttf|otf)$/,
            loader: 'url-loader?limit=10240&name=fonts/[name]-[hash:6].[ext]'
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
        new webpack.NoEmitOnErrorsPlugin(),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: '[name].css',
            chunkFilename: '[id].css',
        }),
        // new HtmlWebpackPlugin({
        //     title:'砼钱',
        //     filename: 'index.html',
        //     template: commonPath.viewHTML,
        //     chunksSortMode: 'auto',
        // }),
        new webpack.HotModuleReplacementPlugin(),
        new BrowserSyncPlugin({
            host: '127.0.0.1',
            port: 8808,
            proxy: 'http://127.0.0.1:8800/',
            logConnections: false,
            notify: false
        }, {
            reload: false
        })
    ]
};


var Koa=require('koa'),
    http = require('http');
var app = new Koa();
var _rotr = require('./src/common/serverApis.js');
import htmlRoute from './src/common/htmlRender.js';
import reactRoute from './src/common/reactRender.js';
import staticRoute from './src/common/staticRender.js'
const koaBody = require('koa-body');//拿来上传文件
const BodyParser = require('koa-bodyparser');
const compiler = webpack(webpackConfig);
app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    watchOptions: {
        ignored: /node_modules/,
    },
    reload: true,
    publicPath: webpackConfig.output.publicPath,
    stats: {
        colors: true
    }
}));
app.use(webpackHotMiddleware(compiler));
app.use(koaBody({
    multipart: true,
    formidable: {
        maxFileSize: 200*1024*1024 // 设置上传文件大小最大限制，默认2M
    }
}));
app.use(async (ctx, next) => {//koa默认的是404，express默认的是200，404时会不再往下执行，所以手动设为200
    ctx.status = 200;
    await next();
});
app.use(BodyParser());
app.use(require('koa-static')(commonPath.staticDir));//koa的静态资源目录
//配置模板引擎
app.use(views(__dirname + '/src/views',{
    extension: enableLocalServerRender?'ejs':'html'
}));
const routesArray = [
    {path:'/',exact:true},
    {path:'/client'},
    {path:'/manager'},
    {path:'/login'},
];
const getMatch=(url)=>{
    return routesArray.some(router=>matchPath(url,{
        path: router.path,
        exact: router.exact,
    }))
};

app.use(async (ctx,next)=>{
    if (getMatch(ctx.path)) {
        if(enableLocalServerRender){
            return await htmlRoute.routes()(ctx,next)
        }
       else{
            return await reactRoute.routes()(ctx,next)
        }
    }
    else if(ctx.path.match(/^.css|.jpg|static/)){
        return await staticRoute.routes()(ctx,next)
    }
    else{
        console.log(ctx.path);
        return await _rotr.routes()(ctx, next)
    }
});

app.use(_rotr.allowedMethods());
// const server = new webpackDevServer(compiler, options);



// server.listen(8800, 'localhost', () => {
//     console.log('dev server listening on port 8800');
// });
// app.use(server);
http.createServer(app.callback()).listen(8800);


