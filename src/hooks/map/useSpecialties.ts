import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

interface Specialty {
  id: number;
  name: string;
  image: string | null;
}

export const useSpecialties = () => {
  const token = useSelector((state: RootState) => state.auth.token);

  return useQuery<Specialty[]>({
    queryKey: ["specialties"],
    queryFn: async () => {
      const res = await api.get("/specialties", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data.specialties;
    },
    enabled: !!token,               // only fetch when token exists
    staleTime: 1000 * 60 * 10,      // 10 minutes – good for static data
    retry: 1,                       // retry only once on failure
  });
};
