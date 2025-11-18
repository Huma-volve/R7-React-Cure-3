"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {  useDispatch } from "react-redux";
import { addCard } from "@/redux/edit-profile/SaveCardsSlice";
import { toast } from "sonner";



interface CreditCardMockupProps {
  closeDialog: () => void;
}

const cardSchema = z.object({
  cardNumber: z
    .string()
    .min(16, "Card number must be 16 digits"),
  cardName: z
    .string()
    .min(2, "Name is required")
    .regex(/^[a-zA-Z\s]+$/, "Only letters allowed"),
  expiry: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Invalid format (MM/YY)"),
  cvv: z
    .string()
    .min(3, "CVV must be 3 digits")
    .max(3, "CVV must be 3 digits")
    .regex(/^\d{3}$/, "Only digits allowed"),
});

type CardFormValues = z.infer<typeof cardSchema>;


export default function CreditCardMockup({ closeDialog }: CreditCardMockupProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const dispatch = useDispatch();


  const {register, handleSubmit, formState: { errors }} =useForm<CardFormValues>({resolver: zodResolver(cardSchema)});

  const onSubmit = (data: CardFormValues) => {  const payload = {
    id: crypto.randomUUID(),
    last4: data.cardNumber.slice(-4),
    cardName: data.cardName,
    expiry: data.expiry,
  };

  dispatch(addCard(payload));

  toast.success("Card saved successfully!");

  closeDialog();

};

  const formatCardNumber = (num: string) => {
    return num.replace(/\s?/g, "").replace(/(\d{4})/g, "$1 ").trim();
  };

  return (
    <div className="max-w-lg mx-auto space-y-8">

<form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-lg mx-auto space-y-8"
    >
      
      <Card className="bg-gradient-to-b from-[#0EFFB7] to-[#5200FF] text-white p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <span className="font-semibold text-lg">VISA</span>
          
        </div>
        <div className="text-xl tracking-widest mb-4">
          {cardNumber ? formatCardNumber(cardNumber) : "#### #### #### ####"}
        </div>
        <div className="flex justify-between text-sm">
          <span>{cardName || "Card Holder"}</span>
          <span>{expiry || "MM/YY"}</span>
        </div>
        <div className="text-right text-sm mt-2">CVV: {cvv || "***"}</div>
      </Card>

     
      <div className="space-y-4">
        <div>
          <Label className="mb-2 mt-1" htmlFor="cardNumber">Card Number</Label>
          <Input
          className="mb-2 border-gray-300"
            id="cardNumber"
            placeholder="1234 5678 9012 3456"
            maxLength={16}
            value={cardNumber}
            {...register("cardNumber")}
            onChange={(e) => setCardNumber(e.target.value)}
          />
          {errors.cardNumber && (<p className="text-red-500 text-sm mt-1">{errors.cardNumber.message}</p>)}
        </div>
        <div>
          <Label className="mb-2 mt-1" htmlFor="cardName">Card Holder</Label>
          <Input
        className="mb-2 border-gray-300"
            id="cardName"
            placeholder="John Doe"
            {...register("cardName")}
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
          />
          {errors.cardName && (<p className="text-red-500 text-sm mt-1">{errors.cardName.message}</p>)}
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <Label className="mb-2 mt-1" htmlFor="expiry">Expiry</Label>
            <Input
            className="mb-2 border-gray-300"
              id="expiry"
              {...register("expiry")}
              placeholder="MM/YY"
              maxLength={5}
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
            />
            {errors.expiry && (<p className="text-red-500 text-sm mt-1">{errors.expiry.message}</p>)}
          </div>

          <div className="flex-1">
            <Label className="mb-2 mt-1" htmlFor="cvv">CVV</Label>
            <Input
             className="mb-2 border-gray-300"
              id="cvv"
              {...register("cvv")}
              placeholder="123"
              maxLength={3}
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
            />
            {errors.cvv && (<p className="text-red-500 text-sm mt-1">{errors.cvv.message}</p>)}
          </div>
        </div>
      </div>

      <Separator />
      <Button type="submit" className="w-full">
        Save Card
      </Button>
    </form>
      
    </div>
  );
}
