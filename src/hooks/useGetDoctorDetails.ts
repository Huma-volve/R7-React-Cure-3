import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useSelector } from "react-redux";
import { type RootState } from "@/redux/store";

export const useGetDoctorDetails = (doctorId: number) => {
    const token = useSelector((state: RootState) => state.auth.token);
    return useQuery({
        queryKey: ["doctor-details", doctorId],
        queryFn: async () => {
            const response = await api.get(`/doctors/${doctorId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data.data;
        },
        enabled: !!doctorId,
    });
};