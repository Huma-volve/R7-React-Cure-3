import { configureStore } from "@reduxjs/toolkit";
import doctorsReducer from "./doctorsSlice";
import authReducer from "./auth/authSlice";
import forgetPasswordReducer from "./auth/forgotPasswordSlice";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web


const persistConfig = {
  key: "auth",         
  storage,              // use localStorage
  whitelist: ["token", "user", "isAuthenticated"], 
};


const persistedAuthReducer = persistReducer(persistConfig, authReducer);


export const store = configureStore({
  reducer: {
    doctors: doctorsReducer,
    auth: persistedAuthReducer,
    forgetPassword:forgetPasswordReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});


export const persistor = persistStore(store);


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const API_URL = "https://round7-cure.huma-volve.com/api/";
