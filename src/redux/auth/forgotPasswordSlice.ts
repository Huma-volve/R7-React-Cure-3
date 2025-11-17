import { createSlice } from '@reduxjs/toolkit'
interface ForgotPasswordState {
  email: string |null;
  otp: string |null;
}

export interface ForgetPasswordLocalState extends ForgotPasswordState {
  currentStep: 'none' | 'otp' | 'resetPassword';
}


const initialState: ForgetPasswordLocalState = {
  email: null,
  otp: null,
  currentStep: 'none',
};

const forgotPasswordSlice = createSlice({
  name: "forgotPassword",
  initialState,
  reducers: {
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setOtp: (state, action) => {
      state.otp = action.payload;
    },
    SetPasswordCurrentStep: (state, action) => {
      state.currentStep = action.payload;},
    resetForgotState: () => initialState,
  },
});

export const { setEmail, setOtp, resetForgotState, SetPasswordCurrentStep } = forgotPasswordSlice.actions;
export default forgotPasswordSlice.reducer;
