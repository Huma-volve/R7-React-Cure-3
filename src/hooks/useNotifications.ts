import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useSelector } from "react-redux";
import { type RootState } from "@/redux/store";

type Notification = {
  id: number;
  user_id: number;
  title: string;
  body: string;
  type: string;
  booking_id?: number;
  is_read: number;
  created_at: string;
  updated_at: string;
};

export const useNotifications = (userId: number | undefined) => {
  const token = useSelector((state: RootState) => state.auth.token);

  return useQuery<Notification[]>({
    queryKey: ["notifications", userId],
    queryFn: async () => {
      const response = await api.get(`/notifications/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const notifications: Notification[] = response.data.data.notifications.data;

      return notifications.filter((noti) => noti.user_id === userId);
    },
    enabled: !!userId,
  });
};