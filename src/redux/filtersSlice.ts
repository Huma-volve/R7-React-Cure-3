import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface FiltersState {
  gender: "male" | "female" | null;
  consultation: "clinic" | "home" | null;
  sort: "recommend" | "low-high" | "high-low" | null;
  availableDay: string[]; // ✅ بقى Array بدل قيمة واحدة
}

const initialState: FiltersState = {
  gender: null,
  consultation: null,
  sort: null,
  availableDay: [] // ✅ مبدئيًا فاضية
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setGender(state, action: PayloadAction<"male" | "female" | null>) {
      state.gender = state.gender === action.payload ? null : action.payload;
    },

    setConsultation(state, action: PayloadAction<"clinic" | "home" | null>) {
      state.consultation =
        state.consultation === action.payload ? null : action.payload;
    },

    setSort(
      state,
      action: PayloadAction<"recommend" | "low-high" | "high-low" | null>
    ) {
      state.sort = state.sort === action.payload ? null : action.payload;
    },

    // ✅ هنا بقى toggle بدل setter
    setAvailableDay(state, action: PayloadAction<"today" | "tomorrow">) {
      const day = action.payload;
      if (state.availableDay.includes(day)) {
        state.availableDay = state.availableDay.filter((d) => d !== day);
      } else {
        state.availableDay.push(day);
      }
    },

    resetFilters(state) {
      state.gender = null;
      state.consultation = null;
      state.sort = null;
      state.availableDay = []; // ✅ ترجّع فاضية
    },
  },
});

export const { setGender, setConsultation, setSort, setAvailableDay, resetFilters } =
  filtersSlice.actions;

export default filtersSlice.reducer;
