"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {Plus, Trash2 } from "lucide-react";
import visa from "/visa.png";
import CreditCardMockup from "./CreditCardMockup";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { useDispatch } from "react-redux";
import { removeCard } from "@/redux/edit-profile/SaveCardsSlice";

export default function SavedCards() {
  
  const [open, setOpen] = useState(false);
  const cardList = useSelector((state: RootState) => state.saveCards.cards);
  const dispatch = useDispatch();

  return (
    <div className="max-w-xl mx-auto py-10 px-6">

      {cardList.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center border rounded-lg bg-white p-8">
          <img
            src="/cardMockup.png"
            alt="No cards"
            className="w-32 h-32 mb-4 "
          />
          <p className="text-muted-foreground mb-6">
            No cards saved yet. Add your cards to make payments easier.
          </p>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger >
              <Button>
                <Plus className="mr-2 w-4 h-4" /> Add Card
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Card</DialogTitle>
              </DialogHeader>
         
              <CreditCardMockup closeDialog={() => setOpen(false)} />

            </DialogContent>
          </Dialog>
        </div>
      ) 
      : (
        <>
        {
      <div className="max-h-80 overflow-y-auto pr-2 space-y-3 mb-8">
      {cardList.map((card) => (
        <div
          key={card.id}
          className="bg-white rounded-lg border p-4 flex flex-col gap-2"
        >
          {/* Top Row: Number + Visa icon */}
          <div className="flex justify-between items-center">
            <span className="font-medium text-base">
              **** **** **** {card.last4}
            </span>
    
            <img className="w-7 h-7" src={visa} />
          </div>
    
          {/* Bottom Row: Expiry + Delete */}
          <div className="flex justify-between text-sm text-gray-600">
            <span>Exp: {card.expiry}</span>
    
            <button
              onClick={() => dispatch(removeCard(card.id))}
              className="text-red-500 hover:text-red-700 transition"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
    }
      
      <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger >
              <Button>
                <Plus className="mr-2 w-4 h-4" /> Add Card
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Card</DialogTitle>
              </DialogHeader>
         
              <CreditCardMockup  closeDialog={() => setOpen(false)} />

            </DialogContent>
          </Dialog>
      </>
      
      )
      
      
      }
    </div>
  );
}
