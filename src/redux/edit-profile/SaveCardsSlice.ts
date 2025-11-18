import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface SavedCard {
  id: string;
  last4: string;
  cardName: string;
  expiry: string;
}

interface CardsState {
  cards: SavedCard[];
}

const initialState: CardsState = {
  cards: [],
};

const cardsSlice = createSlice({
  name: "cards",
  initialState,
  reducers: {
    addCard: (state, action: PayloadAction<SavedCard>) => {
      state.cards.push(action.payload);
    },
    removeCard: (state, action: PayloadAction<string>) => {
      state.cards = state.cards.filter(c => c.id !== action.payload);
    },
  },
});

export const { addCard, removeCard } = cardsSlice.actions;
export default cardsSlice.reducer;
