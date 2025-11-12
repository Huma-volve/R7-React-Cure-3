import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useSelector } from "react-redux";
import { type RootState } from "@/redux/store";

export const useNotifications = (userId: number | undefined) => {
    const token = useSelector((state: RootState) => state.auth.token);
    return useQuery({
        queryKey: ["notifications", userId],
        queryFn: async () => {
            const response = await api.get(`/notifications/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const notifications = response.data.data.notifications.data

            return notifications.filter((noti) => noti.user_id === userId);
        },
        enabled: !!userId,
    });
};