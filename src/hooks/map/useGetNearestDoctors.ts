import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useSelector } from "react-redux";
import { type RootState } from "@/redux/store";

interface GetNearestDocsProps {
  search_query: string;
  lat: number;
  lng: number;
}

interface DoctorResponse {
  data: Array<{
    id: number;
    specialty: string;
    license_number: string;
    clinic_address: string;
    location: {
      lat: number;
      lng: number;
    };
    session_price: number;
    average_rating: number;
    reviews_count: number;
    availability: Record<string, Record<string, string>>;
    consultation: string;
    user: {
      id: number;
      name: string;
      email: string;
      mobile: string;
      profile_photo: string | null;
      gender: string | null;
    };
  }>;
}

export const useGetNearestDoctors = ({
  options,
}: {
  search_query?: string;
  lat?: number;
  lng?: number;
  options?: UseMutationOptions<DoctorResponse, Error, GetNearestDocsProps>;
}) => {
  const token = useSelector((state: RootState) => state.auth.token);

  return useMutation<DoctorResponse, Error, GetNearestDocsProps>({
    mutationFn: async (payload: GetNearestDocsProps) => {
      const { search_query, lat, lng } = payload;
      
      const response = await api.post(
        `/search/history?search_query=${encodeURIComponent(search_query)}&lat=${lat}&lng=${lng}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    ...options,
  });
};