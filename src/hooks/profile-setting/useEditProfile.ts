import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "@/redux/auth/authSlice";
import { normalizeAuthResponse } from "@/lib/authNormalizer";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "sonner"
import type { User } from "@/redux/auth/authSlice";
import type { RootState } from "@/redux/store";

interface EditProfilePayload {
  name?: string;
  birthdate: string;
  profile_photo?: string | null;
  mobile?: string;
  _method: "PUT";
}


interface RegistrationResponse {
  status: boolean
  message: string
  data: User
  token: string
}



const editProfile = async (payload: EditProfilePayload, token:string):Promise<RegistrationResponse> => {
  console.log("🧾 edit profile payload:", payload);
  const {data} = await api.post("/updateProfile", payload, {
    headers: { Authorization: `Bearer ${token}` }});
  return data;
}

export const useEditProfile = () => {

  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);

  return useMutation({
    mutationFn:(payload:EditProfilePayload)=> editProfile(payload, token as string),
    onSuccess: (response) => {
      try {
        const normalizedData = normalizeAuthResponse(response);
        
        dispatch(loginSuccess(normalizedData));
        console.log("✅ Profile updated successfully:", response);
        toast("✅ Profile updated successfully!")

      } catch (error) {
        console.error("Error processing edit profile response:", error);
        toast("Edit profile failed: Invalid response format");
      }
    },
    onError: (error) => {
      console.error("❌ Edit profile error:", error);
      toast("Edit profile failed: An error occurred");
    },
  });
}