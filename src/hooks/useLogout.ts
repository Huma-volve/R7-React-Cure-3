// src/hooks/useLogout.ts
import { useMutation } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "@/redux/store";
import { logout } from "@/redux/auth/authSlice";
import api from "@/lib/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.auth.token);

  return useMutation({
    mutationFn: async () => {
   
      if (!token) throw new Error("No token found");

      const { data } = await api.post("/logout");
      return data;
    },
    onSuccess: () => {
      dispatch(logout()); 
      toast.success("Logged out successfully");
      navigate("/signin"); 
    },
    onError: (error: any) => {
      console.error("Logout failed:", error.response?.data || error.message);
      dispatch(logout());
      toast.info("Session ended locally");
      navigate("/signin");
    },
  });
};
