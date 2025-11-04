import { configureStore } from '@reduxjs/toolkit'
import doctorsReducer from './doctorsSlice'
import authReducer from './auth/authSlice'

export const store = configureStore({
  reducer: {
    doctors: doctorsReducer,
    auth: authReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
