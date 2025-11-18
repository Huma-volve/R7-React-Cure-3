import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface SavedCard {
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

export const cardsSlice = createSlice({
  name: "cards",
  initialState,
  reducers: {
    addCard: (state, action: PayloadAction<SavedCard>) => {
      state.cards.push(action.payload);
    },
    
    updateCard: (state, action: PayloadAction<SavedCard>) => {
      const index = state.cards.findIndex(c => c.id === action.payload.id);
      if (index !== -1) state.cards[index] = action.payload;
    },

    removeCard: (state, action: PayloadAction<string>) => {
      state.cards = state.cards.filter(c => c.id !== action.payload);
    },
  },
});

export const { addCard, updateCard, removeCard } = cardsSlice.actions;
export default cardsSlice.reducer;
