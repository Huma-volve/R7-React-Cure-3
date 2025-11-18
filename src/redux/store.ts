
import { configureStore } from '@reduxjs/toolkit'
import searchReducer from "./searchSlice";
import forgetPasswordReducer from "./auth/forgotPasswordSlice";
import filtersReducer from "./filtersSlice";
import newMobileReducer from "./edit-profile/newPhone";
import SignWithPhoneReducer from "./auth/signinPhoneSlice";
import favoritesReducer from "./favoritesSlice";
import authReducer from "./auth/authSlice";
import saveCardsReducer from "./edit-profile/SaveCardsSlice";

import {persistStore,persistReducer,FLUSH,REHYDRATE,PAUSE,PERSIST,PURGE,REGISTER,} from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web


const persistConfig = {
  key: "auth",         
  storage,              // use localStorage
  whitelist: ["token", "user", "isAuthenticated", "expiresAt"], 
};


const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    search: searchReducer,
    favorites: favoritesReducer,
    filters: filtersReducer,
    auth: persistedAuthReducer,
    forgetPassword:forgetPasswordReducer,
    newMobile: newMobileReducer,
    signWithPhone: SignWithPhoneReducer,
    saveCards: saveCardsReducer,
    
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


export const persistor = persistStore(store);

export const API_URL = "https://round7-cure.huma-volve.com/api/";
