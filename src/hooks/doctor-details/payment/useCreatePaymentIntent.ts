import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useSelector } from "react-redux";
import { type RootState } from "@/redux/store";

export type PaymentMethods = 'paypal' | 'stripe' | 'cash';

type CreatePaymentPayload = {
  booking_id: number;
  gateway: PaymentMethods | string | null;
  currency: string;
  amount: number;
  description: string;
  return_url: string;
  cancel_url: string;
};

type CreatePaymentResponse = {
  data: {
    booking_id: number;
    transaction_id: string;
    gateway: string;
    currency: string;
    amount: number;
    description: string;
    return_url: string;
    cancel_url: string;
  }
};

export const useCreatePaymentIntent = (
  options?: UseMutationOptions<CreatePaymentResponse, unknown, CreatePaymentPayload>
) => {
  const token = useSelector((state: RootState) => state.auth.token);

  return useMutation({
    mutationFn: async (payload: CreatePaymentPayload) => {
      console.log("Payload being sent:", payload);
      const response = await api.post("/payments/create-intent", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("PAYMENT INTENT CREATED");
      return response.data;
    },
    ...options,
  });
};
