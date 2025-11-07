import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/redux/auth/authSlice";
import api from "@/lib/axios";
import type { User } from "@/redux/auth/authSlice";
import { normalizeAuthResponse } from "@/lib/authNormalizer";
import { toast } from "sonner"


interface VerifyPayload {
  mobile: string; 
}


interface VerificationResponse {
  message: string
}



const PhoneVerifyRequest = async (payload: VerifyPayload): Promise<VerificationResponse> => {
  console.log("🧾 signin with phone payload:", payload);
  const { data } = await api.post<VerificationResponse>("/sendOtpFormobileLogin", payload);
  return data;
};

export const useVerifyPhoneLogin = () => {
 
  const navigate = useNavigate();
  
  return useMutation({
    mutationFn: PhoneVerifyRequest,
    onSuccess: () => {
    
        navigate("/phone-login-otp");
       

    },
    onError: (error: any) => {
      console.error("Login failed:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Login failed");
    },
  });
};





interface LoginPayload {
  mobile: string; 
  otp: string;
}


interface loginResponse {
  status: boolean
  message: string
  token: string
  user: User
}


const PhoneloginRequest = async (payload: LoginPayload): Promise<loginResponse> => {
  console.log("🧾 signin with phone payload:", payload);
  const { data } = await api.post<loginResponse>("/verifyOtpForMobileLogin", payload);
  return data;
};

export const usePhoneLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  return useMutation({
    mutationFn: PhoneloginRequest,
    onSuccess: (response) => {
      try {
      
        const normalizedData = normalizeAuthResponse(response);
        
        dispatch(loginSuccess(normalizedData));
        navigate("/");
        toast(`Welcome back, ${normalizedData.user.name}!`)
      } catch (error) {
        console.error("Error processing login response:", error);
        toast.error("Login failed: Invalid response format");
      }
    },
    onError: (error: any) => {
      console.error("Login failed:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Login failed");
    },
  });
};
