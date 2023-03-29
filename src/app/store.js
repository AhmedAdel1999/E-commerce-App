import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer } from 'reduxjs-toolkit-persist';
import storage from 'reduxjs-toolkit-persist/lib/storage'
import thunk from 'redux-thunk';
import userSlice from "../features/shop/userSlice"
import historySlice from '../features/shop/historySlice';
import productSlice from '../features/shop/productSlice';
import categorySlice from '../features/shop/categorySlice';

const persistConfig = {
  key: 'root',
  storage: storage,
};

const reducers = combineReducers({
  user:userSlice,
  category:categorySlice,
  product:productSlice,
  history:historySlice,
});

const _persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: _persistedReducer,
  middleware: [thunk]
});
