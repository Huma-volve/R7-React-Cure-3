import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { User } from "@/redux/auth/authSlice";
import { toast } from "sonner"
import { useDispatch } from "react-redux";
import { normalizeAuthResponse } from "@/lib/authNormalizer";
import { loginSuccess } from "@/redux/auth/authSlice";

interface SignupPayload {
  name: string;
  email: string; 
  mobile: string;
  birthdate: string;
  password: string;
}

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

type authResponse = RegistrationResponse | VerificationResponse | LogInResponse;

const signupRequest = async (payload: SignupPayload): Promise<authResponse> => {
  console.log("🧾 Signup payload:", payload);
  const {data}= await api.post<authResponse>("/register", payload);
  return data;
};

export const useSignup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  return useMutation({
    mutationFn: signupRequest,
    onSuccess: (response) => {
      const normalizedData = normalizeAuthResponse(response);
      dispatch(loginSuccess(normalizedData));
      navigate("/verify-account");
      toast.success("Signup successful! Please verify your email.");
    },
    onError: () => {
      toast.error("Signup failed. Please try again.");
    }
  });
}