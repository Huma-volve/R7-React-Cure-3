import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "@/redux/auth/authSlice";
import { normalizeAuthResponse } from "@/lib/authNormalizer";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "sonner"
import type { User } from "@/redux/auth/authSlice";
import type { RootState } from "@/redux/store";
import type { AxiosError } from "axios";



interface ChangePasswordPayload {
  current_password: string;
  password: string;
  _method: "PUT";
}

interface RegistrationResponse {
  status: boolean
  message: string
  data: User
  token: string
}

const changePasswordRequest = async (payload: ChangePasswordPayload, token:string): Promise<RegistrationResponse> => {
  console.log("🧾 change password payload:", payload);
  const {data}= await api.post<RegistrationResponse>("/updateProfile", payload, {
    headers: { Authorization: `Bearer ${token}` }});
  return data;
}

export const useChangePassword = () => {

  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);

  return useMutation({
    mutationFn:(payload:ChangePasswordPayload)=> changePasswordRequest(payload, token as string),
    onSuccess: (response) => {
      try {
        const normalizedData = normalizeAuthResponse(response);
        
        dispatch(loginSuccess(normalizedData));
        console.log("✅ Password changed successfully:", response);
        toast("✅ Password changed successfully!")

      } catch (error) {
        console.error("Error processing change password response:", error);
        toast("Change password failed: Invalid response format");
      }
    },
    onError: (error) => {
      const err = error as AxiosError<any>;

      const backendMessage =
        err.response?.data?.message ||
        err.message ||
        "Something went wrong";
    
      toast(backendMessage);
    },
  });
}