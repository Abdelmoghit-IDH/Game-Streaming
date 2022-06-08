import React from 'react'
import {
  Provider,
  createStoreHook,
  createDispatchHook,
  createSelectorHook
} from 'react-redux'
import App from "./App";

import { persistor, store } from './app/store';
import { PersistGate } from 'redux-persist/integration/react';

const customContext = React.createContext(null)

export const useCustomStore = createStoreHook(customContext)
export const useCustomDispatch = createDispatchHook(customContext)
export const useCustomSelector = createSelectorHook(customContext)

export function MyProvider({ children }) {
  return (
    <Provider context={customContext} store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  )
}