import React from 'react'
var router = require('koa-router');

const renderhandler=async (ctx,next)=>{
    console.error('>>>>>>>>>>',ctx.path)
    await ctx.render('index')
};
var reactRoute = new router();
reactRoute.get('*', renderhandler);
reactRoute.post('*', renderhandler);

export default reactRoute;