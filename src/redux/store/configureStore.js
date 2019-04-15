import { createStore, applyMiddleware ,compose} from 'redux'
import thunkMiddleware from 'redux-thunk'
import rootReducer from './index.js'
import {fromJS} from 'immutable'
export default function configureStore(initialState) {
    const store = createStore(
      //包含所有的reducer
        rootReducer,
        fromJS(initialState),
        compose(applyMiddleware(thunkMiddleware))
    );
  return store;
}


