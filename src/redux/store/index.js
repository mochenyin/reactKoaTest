/**
 * Created by SWSD on 2018-11-02.
 */
import {combineReducers} from 'redux-immutable';
import initReducer from '../reducers/initReducer';
//reducer用于描述数据的状态和相应的变更
const rootReducer = combineReducers({
    initReducer,
});

export default rootReducer;
