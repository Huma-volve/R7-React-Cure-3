import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { loginSuccess} from "@/redux/auth/authSlice";
import api from "@/lib/axios";
import type { User } from "@/redux/auth/authSlice";
import { toast } from "sonner"

interface LoginPayload {
  email: string; 
  password: string;
}

interface LoginResponse {
  0: User;
  token: string;
}


const loginRequest = async (payload: LoginPayload): Promise<LoginResponse> => {
  const { data } = await api.post<LoginResponse>("/login", payload);
  return data;
};


export const useLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: loginRequest,
    onSuccess: (response) => {
      console.log("✅ Login success:", response);
      dispatch(loginSuccess({ response }));
      navigate("/");
      toast(`Welcome back, ${response[0].name}!`)
    },
    onError: (error: any) => {
      console.error("Login failed:", error.response?.data || error.message);
    },
  });
};
