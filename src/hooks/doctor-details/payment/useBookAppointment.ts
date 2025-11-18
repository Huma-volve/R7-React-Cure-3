import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useSelector } from "react-redux";
import { type RootState } from "@/redux/store";
import type { PaymentMethods } from "./useCreatePaymentIntent";

type BookingPayload = {
  doctor_id: number;
  date_time: string;
  payment_method: PaymentMethods | string | null;
  return_url: string;
  cancel_url: string;
};

export const useBookAppointment = (
  options?: UseMutationOptions<any, unknown, BookingPayload>
) => {
  const token = useSelector((state: RootState) => state.auth.token);

  return useMutation({
    mutationFn: async (payload: BookingPayload) => {
      const response = await api.post("/patient/bookings", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    ...options,
  });
};
