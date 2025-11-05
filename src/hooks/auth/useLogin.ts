import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/redux/auth/authSlice";
import api from "@/lib/axios";
import type { User } from "@/redux/auth/authSlice";
import { normalizeAuthResponse } from "@/lib/authNormalizer";
import { toast } from "sonner"

interface LoginPayload {
  email: string; 
  password: string;
}

// Define the union type for all possible responses
interface RegistrationResponse {
  status: boolean
  message: string
  data: User
  token: string
}

interface VerificationResponse {
  status: boolean
  message: string
  token: string
  user: User
}

interface LogInResponse {
  0: User
  token: string
}

type authResponse = RegistrationResponse | VerificationResponse | LogInResponse

const loginRequest = async (payload: LoginPayload): Promise<authResponse> => {
  console.log("🧾 signin payload:", payload);
  const { data } = await api.post<authResponse>("/login", payload);
  return data;
};

export const useLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  return useMutation({
    mutationFn: loginRequest,
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