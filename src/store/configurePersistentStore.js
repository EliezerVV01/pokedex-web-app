import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web 
import reducer from './reducers/reducer'
import thunk from 'redux-thunk';


const persistConfig = {
    key: 'root',
    storage,
    whitelist:['auth', 'token', 'userEmail']
}

const persistedReducer = persistReducer(persistConfig, reducer);


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(persistedReducer,  composeEnhancers(
        applyMiddleware(thunk)));   
export const persistor = persistStore(store)
  

