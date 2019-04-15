/**
 * Created by SWSD on 2018-11-15.
 */
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {Provider} from 'react-redux'
import configureStore from 'REDUX/store/configureStore'
import App from 'COMPONENT/container.jsx';


const render = async (ctx) => {
    let content;
    try {
        const store = configureStore();
         content = ReactDOMServer.renderToString(
            <Provider store={store}>
               <App />
            </Provider>,
        );
    } catch (error) {
        content='错误信息：'+error
    }
    await ctx.body=content;
};

export default render;
