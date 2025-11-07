import { createSlice } from '@reduxjs/toolkit'

export interface SignWithPhoneState {
  mobile: string |null;
}

 const initialState: SignWithPhoneState = {
  mobile: null,
};

const SignWithPhoneSlice = createSlice({
  name: "SignWithPhone",
  initialState,
  reducers: {
    setMobile: (state, action) => {
      state.mobile = action.payload;
    },
    resetMobileState: () => initialState,


    
  },
});

export const { setMobile, resetMobileState } = SignWithPhoneSlice.actions;
export default SignWithPhoneSlice.reducer;
