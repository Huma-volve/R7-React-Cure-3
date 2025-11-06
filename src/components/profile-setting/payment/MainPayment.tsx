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
import { Plus } from "lucide-react";
import CreditCardMockup from "./CreditCardMockup";

export default function SavedCards() {
  const [cards] = useState<any[]>([]); 

  return (
    <div className="max-w-xl mx-auto py-10 px-6">

      {cards.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center border rounded-lg bg-white p-8">
          <img
            src="../../../public/cardMockup.png"
            alt="No cards"
            className="w-32 h-32 mb-4 "
          />
          <p className="text-muted-foreground mb-6">
            No cards saved yet. Add your cards to make payments easier.
          </p>

          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 w-4 h-4" /> Add Card
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Card</DialogTitle>
              </DialogHeader>
         
              <CreditCardMockup />

            </DialogContent>
          </Dialog>
        </div>
      ) : null}
    </div>
  );
}
