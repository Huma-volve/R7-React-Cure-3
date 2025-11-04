import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { loginSuccess} from "@/redux/auth/authSlice";
import api from "@/lib/axios";
import type { User } from "@/redux/auth/authSlice";

interface LoginPayload {
  identifier: string; // can be email or phone
  password: string;
}

interface LoginResponse {
  0: User;
  token: string;
}

// API request function
const loginRequest = async (payload: LoginPayload): Promise<LoginResponse> => {
  const { data } = await api.post<LoginResponse>("/login", payload);
  return data;
};

// Custom hook
export const useLogin = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: loginRequest,
    onSuccess: (response) => {
      dispatch(loginSuccess({ response }));
    },
    onError: (error: any) => {
      console.error("Login failed:", error.response?.data || error.message);
    },
  });
};
