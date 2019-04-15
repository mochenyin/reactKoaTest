/**
 * Created by SWSD on 2018-11-02.
 */
import Immutable, { fromJS } from 'immutable'
import * as Types from '../constants/index'
const initialState = Immutable.fromJS({
   
});
const getNewStateFunc=(state,action)=>{
    const typeInfo={
        [Types.SHOW_ERRORMESSAGE]: (state, action) => {
            return state.merge({
                loading: false,
            })
        },
    }
    return typeInfo[action.type]||state;
};
export default (state=initialState,action)=>{
    return getNewStateFunc(state,action)
}
