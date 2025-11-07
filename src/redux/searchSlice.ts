import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const token = "s9iLbmOm7YfR82m1Uw5m7y8RfXoEXXtrJVaV1ChCabb64743";

interface DoctorState {
  query: string;
  results: any[];
  originalData: any[];
  loading: boolean;
  error: string | null;
}

const initialState: DoctorState = {
  query: "",
  results: [],
  originalData: [],
  loading: false,
  error: null,
};

// ✅ 1) Fetch all doctors (مرة واحدة)
export const fetchAllDoctors = createAsyncThunk(
  "search/fetchAllDoctors",
  async () => {
    const res = await axios.get(
      `https://round7-cure.huma-volve.com/api/doctors`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log(res.data.data.data)
    return res.data.data.data;
  }
);

// ✅ 2) Search doctors (API منفصلة تماماً)
export const searchDoctors = createAsyncThunk(
  "search/searchDoctors",
  async (query: string) => {

    const res = await axios.post(
      `https://round7-cure.huma-volve.com/api/store-search-history?search_query=${query}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    const results = res.data?.data?? []; // ✅ fallback array

    return { query, results };
  }
);


const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setQuery(state, action) {
      state.query = action.payload;
    },
    resetResults(state) {
      state.results = state.originalData; // نرجع الأصل
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Fetch Doctors
      .addCase(fetchAllDoctors.fulfilled, (state, action) => {
        state.originalData = action.payload;
        state.results = action.payload;
      })

      // ✅ Search Results (من الـ API مباشرة بدون فلترة)
      .addCase(searchDoctors.fulfilled, (state, action) => {
        state.query = action.payload.query;
        state.results = action.payload.results; // بدون فلترة
      });
  },
});

export const { setQuery, resetResults } = searchSlice.actions;
export default searchSlice.reducer;
