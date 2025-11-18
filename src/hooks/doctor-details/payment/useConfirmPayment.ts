import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useSelector } from "react-redux";
import { type RootState } from "@/redux/store";
import type { PaymentMethods } from "./useCreatePaymentIntent";

type ConfirmPaymentPayload = {
  gateway: PaymentMethods | string | null;
  payment_id: string;
};

type ConfirmPaymentResponse = {
  success: boolean;
  status: number;
  message: string;
  data: {
    status: string;
    provider: string;
    payment_id: string;
  };
};

export const useConfirmPayment = (
  options?: UseMutationOptions<ConfirmPaymentResponse, unknown, ConfirmPaymentPayload>
) => {
  const token = useSelector((state: RootState) => state.auth.token);

  return useMutation({
    mutationFn: async (payload: ConfirmPaymentPayload) => {
      const response = await api.post("/payments/confirm", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("PAYMENT CONFIRMED");
      return response.data;
    },
    ...options,
  });
};
