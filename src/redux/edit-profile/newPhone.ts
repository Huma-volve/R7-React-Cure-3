import { createSlice } from '@reduxjs/toolkit'
interface ForgotPasswordState {
  new_mobile: string | null;
}

const initialState: ForgotPasswordState = {
  new_mobile: null,
};

const newPhoneSlice = createSlice({
  name: "newPhone",
  initialState,
  reducers: {
    setNewMobile: (state, action) => {
      state.new_mobile = action.payload;
    },
    resetNewPhoneState: () => initialState,
  },
});

export const { setNewMobile, resetNewPhoneState } = newPhoneSlice.actions;
export default newPhoneSlice.reducer;