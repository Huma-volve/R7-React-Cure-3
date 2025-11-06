import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { User } from "@/redux/auth/authSlice";
import { normalizeAuthResponse } from "@/lib/authNormalizer";
import { toast } from "sonner"
import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "@/redux/store"; 
import { loginSuccess } from "@/redux/auth/authSlice";



interface OtpPayload {
email: string;
otp: string;
}


interface VerificationResponse {
  status: boolean
  message: string
  token: string
  user: User
}

const otpVerificationRequest = async (payload: OtpPayload, token:string): Promise<VerificationResponse> => {
  console.log("🧾 otp payload:", payload);
  const {data}= await api.post<VerificationResponse>("/verifyEmailOtp", payload, {
    headers: { Authorization: `Bearer ${token}` }},);
  return data;
};

export const useOTP = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);
  return useMutation (
    {
      mutationFn: (payload: OtpPayload) => otpVerificationRequest(payload, token as string),
      onSuccess: (data) => {
        const normalizedData = normalizeAuthResponse(data);
        dispatch(loginSuccess(normalizedData));
        navigate("/");
        toast.success("Account verified successfully!");
        return normalizedData;
      },
      onError: () => {
        toast.error("OTP verification failed. Please try again.");
      }
    }
  )
}
