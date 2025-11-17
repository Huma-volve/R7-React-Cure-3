import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useSelector } from "react-redux";
import { type RootState } from "@/redux/store";

export const useGetAvailableSlots = (doctorId: number | undefined) => {
  const token = useSelector((state: RootState) => state.auth.token);

  return useQuery({
    queryKey: ["availability", doctorId],
    queryFn: async () => {
      const response = await api.get(`/doctors/${doctorId}/available-slots`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Extract the availability object from the response
      const availability = response.data.data.availability;
      return availability;
    },
    enabled: !!doctorId,
  });
};
