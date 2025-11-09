import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import type { RootState } from "./store";
import axios from "axios";



interface DoctorState {
  query: string;
  results: any[];
  originalData: any[];
  loading: boolean;
  error: string | null;
  currentPage: Number,
  lastPage: Number,
}

const initialState: DoctorState = {
  query: "",
  results: [],
  originalData: [],
  loading: false,
  error: null,
  currentPage: 1,
  lastPage: 1,
};

// ✅ 1) Fetch all doctors (مرة واحدة)
export const fetchAllDoctors = createAsyncThunk(
  "search/fetchAllDoctors",
  async (page: number = 1, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.token; 

    const res = await axios.get(
      `https://round7-cure.huma-volve.com/api/doctors?page=${page}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return {
      data: res.data.data,
      current_page: res.data.meta.current_page, // ✅ من meta
      last_page: res.data.meta.last_page        // ✅ من meta
    };
  }
);


// ✅ 2) Search doctors (API منفصلة تماماً)
export const searchDoctors = createAsyncThunk(
  "search/searchDoctors",
  async (query: string, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.token; 
    const res = await axios.post(
      `https://round7-cure.huma-volve.com/api/search/history?search_query=${query}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const results = res.data?.data ?? [];

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
  // Fetch All Doctors
  builder
    .addCase(fetchAllDoctors.pending, (state) => {
      state.loading = true;
    })
    .addCase(fetchAllDoctors.fulfilled, (state, action) => {
  state.originalData = action.payload.data;
  state.results = action.payload.data;
  state.currentPage = action.payload.current_page;
  state.lastPage = action.payload.last_page;
  state.loading = false;
})

    .addCase(fetchAllDoctors.rejected, (state) => {
      state.loading = false;
      state.error = "Failed to fetch doctors";
    });

  // Search Doctors
  builder
    .addCase(searchDoctors.pending, (state) => {
      state.loading = true;
    })
    .addCase(searchDoctors.fulfilled, (state, action) => {
      state.query = action.payload.query;
      state.results = action.payload.results;
      state.loading = false;
    })
    .addCase(searchDoctors.rejected, (state) => {
      state.loading = false;
      state.error = "Search failed";
    })
},

});

export const { setQuery, resetResults } = searchSlice.actions;
export default searchSlice.reducer;
