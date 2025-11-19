import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

export const useDeleteReview = () => {
  const token = useSelector((state: RootState) => state.auth.token);

  return useMutation({
    mutationFn: async (review_id: number) => {
      const response = await api.delete(`/reviews/${review_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    },
  });
};
