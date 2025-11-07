import { createSlice } from '@reduxjs/toolkit'
interface ForgotPasswordState {
  email: string |null;
  otp: string |null;
}

const initialState: ForgotPasswordState = {
  email: null,
  otp: null,
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
    resetForgotState: () => initialState,
  },
});

export const { setEmail, setOtp, resetForgotState } = forgotPasswordSlice.actions;
export default forgotPasswordSlice.reducer;
