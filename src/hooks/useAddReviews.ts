import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useSelector } from "react-redux";
import { type RootState } from "@/redux/store";

export const useAddReview = () => {
  const token = useSelector((state: RootState) => state.auth.token);

  return useMutation({
    mutationFn: async (newReview: { doctor_id: number; booking_id: number; patient_id: number | undefined; rating: number; comment: string }) => {
      console.log("Sending review:", newReview);
      console.log("Token:", token); // Add this
      const response = await api.post("/reviews", newReview, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
  });
};
