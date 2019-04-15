import React, {Component}from 'react'
import {ajaxServer,Ajax} from '../common/common'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux';
import * as Actions from '../redux/actions/index';
import RouterSwitch from './routerSwith'
import { withRouter } from 'react-router-dom';
// import SelectUploadPic from './commonComp/selectUploadPic.jsx'
class Container extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {//服务端渲染时，如果在willMount时调用ajax，会报错，因为node环境没有window这个对象，解决方法：1可以在didMount里执行，2使用懒加载
        Ajax.post('/getUserInfo',{userId:1}).then(result=>{
            console.log('testResult',result)
        })
    }

    render() {
        return (RouterSwitch)
    }
}
//告诉高阶组件需要 mainTodos: state.get('initReducer')
function mapStateToProps(state) {
    return {
        mainTodos: state.get('initReducer'),
    }
}
// 可以给高级组件传入来告诉它我们的组件需要如何触发 dispatch
function mapDispatchToProps(dispatch) {
    return {
        //就是在子组件未察觉redux的情况下，将dispatch传递给子组件。
        mainActions: bindActionCreators(Actions, dispatch),
    }
}
module.exports = withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(Container));

