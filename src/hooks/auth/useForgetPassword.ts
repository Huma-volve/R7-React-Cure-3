import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "sonner"


interface ForgetPasswordPayload {
  email: string;
}

const forgetPasswordRequest = async (payload: ForgetPasswordPayload): Promise<{status: boolean; message: string}> => {
  console.log("🧾 forget password payload:", payload);
  const {data}= await api.post<{status: boolean; message: string}>("/forgot-password/send-otp", payload);
  return data;
}

export const useForgetPassword = () => {
  const navigate = useNavigate();
  
  return useMutation({
    mutationFn: forgetPasswordRequest,
    onSuccess: (response) => {
      if (response.status) {
        navigate("/forget-password-otp");
        toast.success("OTP sent to your phone! Please verify.");
      } else {
        toast.error("Failed to send OTP. Please try again.");
      }
    },
    onError: () => {
      toast.error("An error occurred. Please try again.");
    }
  });
}


interface verifyOtpPayload {
  email: string;
  otp: string;
}


const VerifyforgetPasswordRequest = async (payload: verifyOtpPayload): Promise<{status: boolean; message: string}> => {
  console.log("🧾 otp forget password payload:", payload);
  const {data}= await api.post<{status: boolean; message: string}>("forgot-password/verify-otp", payload);
  return data;
}


export const useVerifyForgetPassword = () => {
  const navigate = useNavigate();
  
  return useMutation({
    mutationFn: VerifyforgetPasswordRequest,
    onSuccess: (response) => {
      if (response.status) {
        navigate("/reset-password");
        toast.success("OTP sent to your phone! Please verify.");
      } else {
        toast.error("Failed to send OTP. Please try again.");
      }
    },
    onError: () => {
      toast.error("An error occurred. Please try again.");
    }
  });
}


interface ResetPasswordPayload {
  email: string;
  otp: string;
  password: string;
}

const ResetPasswordRequest = async (payload: ResetPasswordPayload): Promise<{status: boolean; message: string}> => {
  console.log("🧾 reset password payload:", payload);
  const {data}= await api.post<{status: boolean; message: string}>("forgot-password/reset", payload);
  return data;
}

export const useResetPassword = () => {
  const navigate = useNavigate();
  
  return useMutation({
    mutationFn: ResetPasswordRequest,
    onSuccess: (response) => {
      if (response.status) {
        navigate("/signin");
        toast.success("Password reset successful! Please sign in.");
      } else {
        toast.error("Failed to reset password. Please try again.");
      }
    },
    onError: () => {
      toast.error("An error occurred. Please try again.");
    }
  });
}