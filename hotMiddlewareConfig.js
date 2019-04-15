/**
 * Created by SWSD on 2018-11-05.
 */
const webpackHotMiddleware =require('webpack-hot-middleware');//webpack-hot-middleware一般与express框架搭配使用，若要与koa一起使用，需做部分修改

const newHotMiddleware= (compiler) => {
    const middleware = webpackHotMiddleware(compiler);
    // CAUTION: explicitly return middleware here because we don't want to
    // initialize webpackDevMiddleware instance through every request.
    return async (context, next) => {
        const hasNext = await applyMiddleware(middleware, context.req,context.res, {
            send: content => context.body = content,
            writeHead: function() {context.set.apply(context, arguments)}
        });
        hasNext && await next();
    };
}
function applyMiddleware(middleware, req, res) {
    const _send = res.send;
    return new Promise((resolve, reject) => {
        try {
            res.send = function() {_send.apply(res, arguments) && resolve(false)};
            middleware(req, res, resolve.bind(null, true));
        } catch (error) {
            reject(error);
        }
    });
}

module.exports=newHotMiddleware;