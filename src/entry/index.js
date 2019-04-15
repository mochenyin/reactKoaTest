/**
 * Created by SWSD on 2018-11-02.
 */
/* 入口启动文件 */
import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import configureStore from 'REDUX/store/configureStore'
import App from 'COMPONENT/container.jsx';
import { BrowserRouter as Router } from  "react-router-dom";
// ================================
// 将根组件挂载到 DOM，启动！
// ================================
const store = configureStore(window.__STATE__);
//mount 挂载
const MOUNT_NODE = document.getElementById('index');
// 把 Provider 作为组件树的根节点

ReactDOM.render(
    <Provider store={store}>
        <Router>
         <App />
        </Router>
    </Provider>, MOUNT_NODE)
if (module.hot) {
    module.hot.accept()
}