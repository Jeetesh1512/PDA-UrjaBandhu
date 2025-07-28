'use client'
import {configureStore, combineReducers} from '@reduxjs/toolkit'
import authReducer from './slices/authslice'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'root',
  storage,
}

const rootReducer = combineReducers({
    auth:authReducer,
})

const persistedReducer = persistReducer(persistConfig,rootReducer);

export const store = configureStore({
    reducer: persistedReducer
})

export const persistor = persistStore(store);