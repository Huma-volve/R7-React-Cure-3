import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "./store";


// Toggle favorite على السيرفر
export const toggleFavoriteOnServer = createAsyncThunk(
  "favorites/toggleFavoriteOnServer",
  async (doctorId: number, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.token;
    await axios.post(
      `https://round7-cure.huma-volve.com/api/favorites/toggle/${doctorId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return doctorId;
  }
);

// جلب كل المفضلات عند تحميل الصفحة
export const fetchFavoritesFromServer = createAsyncThunk(
  "favorites/fetchFavoritesFromServer",
  async (_, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.token;
    const res = await axios.get(
      "https://round7-cure.huma-volve.com/api/favorites",
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // نحفظ IDs فقط
    return res.data?.data?.favorites?.map((fav: any) => fav.doctor_id) ?? [];
  }
);

// التحقق من حالة طبيب معين
export const checkFavoriteStatus = createAsyncThunk(
  "favorites/checkFavoriteStatus",
  async (doctorId: number, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.token;
    const res = await axios.get(
      `https://round7-cure.huma-volve.com/api/favorites/check/${doctorId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return { doctorId, isFavorite: res.data?.data?.is_favorite};
  }
);

interface FavoritesState {
  list: number[]; // قائمة IDs المفضلة
}

const initialState: FavoritesState = { list: [] };

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchFavoritesFromServer.fulfilled, (state, action) => {
      state.list = action.payload;
    });

    builder.addCase(toggleFavoriteOnServer.fulfilled, (state, action) => {
      const id = action.payload;
      if (state.list.includes(id)) {
        state.list = state.list.filter((x) => x !== id);
      } else {
        state.list.push(id);
      }
    });

    builder.addCase(checkFavoriteStatus.fulfilled, (state, action) => {
      const { doctorId, isFavorite } = action.payload;
      if (isFavorite && !state.list.includes(doctorId)) state.list.push(doctorId);
      if (!isFavorite && state.list.includes(doctorId))
        state.list = state.list.filter((x) => x !== doctorId);
    });
  },
});

export default favoritesSlice.reducer;
