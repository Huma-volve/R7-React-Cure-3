"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function CreditCardMockup() {
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");


  const formatCardNumber = (num: string) => {
    return num.replace(/\s?/g, "").replace(/(\d{4})/g, "$1 ").trim();
  };

  return (
    <div className="max-w-lg mx-auto space-y-8">
      
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <span className="font-semibold text-lg">VISA</span>
          <span className="text-sm">**** **** **** {cardNumber.slice(-4)}</span>
        </div>
        <div className="text-xl tracking-widest mb-4">
          {cardNumber ? formatCardNumber(cardNumber) : "#### #### #### ####"}
        </div>
        <div className="flex justify-between text-sm">
          <span>{cardName || "Card Holder"}</span>
          <span>{expiry || "MM/YY"}</span>
        </div>
        <div className="text-right text-sm mt-2">CVV: {cvv ? "***" : "***"}</div>
      </Card>

     
      <div className="space-y-4">
        <div>
          <Label htmlFor="cardNumber">Card Number</Label>
          <Input
            id="cardNumber"
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="cardName">Card Holder</Label>
          <Input
            id="cardName"
            placeholder="John Doe"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <Label htmlFor="expiry">Expiry</Label>
            <Input
              id="expiry"
              placeholder="MM/YY"
              maxLength={5}
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="cvv">CVV</Label>
            <Input
              id="cvv"
              placeholder="123"
              maxLength={3}
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Separator />

      
    </div>
  );
}
