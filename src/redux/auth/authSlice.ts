import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface DoctorInfo {
  id: number
  specialty: string
  license_number: string
  clinic_address: string
  location: { lat: number; lng: number }
  session_price: number
  availability: string
}

interface PatientInfo {
  birthdate: string
  gender: string
  medical_notes: string | null
}

export interface User {
  id: number
  name: string
  email: string
  mobile: string
  birthdate: string
  gender?: 'male' | 'female'
  profile_photo: string | null
  role: 'doctor' | 'patient' | 'admin'
  doctor?: DoctorInfo
  patient?: PatientInfo
}

interface AuthState {
  user: User | null
  token: string | null
  expiresAt: number | null
  isAuthenticated: boolean
}

export interface LogInLocalState extends AuthState {
  currentStep: 'none' | 'otp';
}


const initialState: LogInLocalState = {
  user: null,
  token: null,
  isAuthenticated: false,
  expiresAt: null,
  currentStep: 'none',
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      const ONE_HOUR_MS = 60 * 60 * 1000
      state.expiresAt = Date.now() + ONE_HOUR_MS
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.expiresAt = null
    },
    setCurrentStep: (state, action) => {state.currentStep= action.payload;},
  },
})

export const { loginSuccess, logout, setCurrentStep } = authSlice.actions
export default authSlice.reducer