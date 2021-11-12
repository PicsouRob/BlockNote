import { createStore, applyMiddleware } from 'redux';
import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import thunk from 'redux-thunk';

import Reducer from './Reducer';

const rootPersistConfig = {
    key: 'root',
    storage: AsyncStorage,
}

const store = createStore(persistReducer(rootPersistConfig, Reducer, applyMiddleware(thunk)));

export default store;
