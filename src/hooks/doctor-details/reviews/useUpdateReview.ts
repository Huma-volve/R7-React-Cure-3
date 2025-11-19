import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

export const useUpdateReview = () => {
  const token = useSelector((state: RootState) => state.auth.token);

  return useMutation({
    mutationFn: async (updatedReview: {
      booking_id: number | undefined;
      patient_id: number | undefined;
      doctor_id: number;
      review_id: number;
      rating: number;
      comment: string;
    }) => {
      const { review_id, ...body } = updatedReview;

      const response = await api.put(`/reviews/${review_id}`, body, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    },
  });
};

