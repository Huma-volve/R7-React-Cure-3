import { configureStore } from '@reduxjs/toolkit'
import doctorsReducer from './doctorsSlice'
import searchReducer from "./searchSlice";
import favoritesReducer from "./favoritesSlice";

export const store = configureStore({
  reducer: {
    doctors: doctorsReducer,
    search: searchReducer,
    favorites: favoritesReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch