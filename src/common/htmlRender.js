import ReactDOMServer from 'react-dom/server';
import { StaticRouter, matchPath } from 'react-router-dom';
import App from '../components/container.jsx';
import {Provider} from 'react-redux'
import configureStore from '../redux/store/configureStore'
import React from 'react'
var router = require('koa-router');

const renderhandler=async (ctx,next)=>{
    const store = configureStore();
        const html=ReactDOMServer.renderToString(
            <Provider store={store}>
            <StaticRouter
        location={ctx.path}
        context={ctx}
            >
            <App />
            </StaticRouter>
            </Provider>);
        await ctx.render('index',{content:html,state: store.getState()})
};
var htmlRoute = new router();
htmlRoute.get('*', renderhandler);
htmlRoute.post('*', renderhandler);

export default htmlRoute;