import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { User } from "@/redux/auth/authSlice";
import { normalizeAuthResponse } from "@/lib/authNormalizer";
import { toast } from "sonner"

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

const otpVerificationRequest = async (payload: OtpPayload): Promise<VerificationResponse> => {
  const {data}= await api.post<VerificationResponse>("/verify-otp", payload);
  return data;
};

export const useOTP = () => {
  const navigate = useNavigate();
  return useMutation (
    {
      mutationFn: otpVerificationRequest,
      onSuccess: (data) => {
        const normalizedData = normalizeAuthResponse(data);
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
