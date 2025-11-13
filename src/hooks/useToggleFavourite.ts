import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useSelector } from "react-redux";
import { type RootState } from "@/redux/store";

export const useToggleFavourite = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (doctorId: number) => {
      const response = await api.post(`/favorites/toggle/${doctorId}`, {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data; // returns the API response (added/removed)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
};
