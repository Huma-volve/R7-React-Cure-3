import { createSlice } from '@reduxjs/toolkit'

export interface SignWithPhoneState {
  mobile: string |null;
}

export interface SignWithPhoneLocalState extends SignWithPhoneState {
  currentStep: 'none' | 'otp';
}


const initialState: SignWithPhoneLocalState = {
  mobile: null,
  currentStep: 'none',
};

const SignWithPhoneSlice = createSlice({
  name: "SignWithPhone",
  initialState,
  reducers: {
    setMobile: (state, action) => {
      state.mobile = action.payload;
    },
    setCurrentStep: (state, action) => {state.currentStep= action.payload;},
    resetMobileState: () => initialState,


    
  },
});

export const { setMobile, resetMobileState, setCurrentStep } = SignWithPhoneSlice.actions;
export default SignWithPhoneSlice.reducer;
