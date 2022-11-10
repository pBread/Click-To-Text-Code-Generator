import { isDev, isServer } from "utilities";
import type { Middleware } from "@reduxjs/toolkit";
import { combineReducers, configureStore, Store } from "@reduxjs/toolkit";
import { useMemo } from "react";
import { createDispatchHook, createSelectorHook } from "react-redux";
import { createLogger } from "redux-logger";

const middleware = [];
if (isDev) middleware.push(createLogger({ predicate: () => !isServer }));
const reducer = combineReducers({});

let store: Store;
export const getOrMakeStore = (preloadedState?: { [key: string]: any }) => {
  if (store) return store;
  store = configureStore({
    ...(preloadedState ? { preloadedState } : {}),
    middleware: (getDefault) => getDefault().concat(middleware),
    reducer,
  });

  return store;
};

// @ts-ignore... for debugging only
if (isDev && !isServer) window.STORE = store;

export type AppStore = ReturnType<typeof getOrMakeStore>;
export type AppState = ReturnType<typeof reducer>;

export type AppAction = ReturnType<typeof store.dispatch>;
export type AppDispatch = typeof store.dispatch;
export type AppMiddleware = Middleware<AppDispatch, AppState>;

export const useDispatch = createDispatchHook<AppState, AppAction>();
export const useSelector = createSelectorHook<AppState>();
export const useStore = () => useMemo(() => store, []);
