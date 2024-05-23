import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer } from 'reduxjs-toolkit-persist';
import storage from 'reduxjs-toolkit-persist/lib/storage'
import thunk from 'redux-thunk';
import userSlice from "../features/userSlice"
import productSlice from '../features/productSlice';

const persistConfig = {
  key: 'root',
  storage: storage,
};

const reducers = combineReducers({
  user:userSlice,
  product:productSlice,
});

const _persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: _persistedReducer,
  middleware: [thunk]
});
