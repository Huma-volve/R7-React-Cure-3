import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "@/redux/auth/authSlice";
import { normalizeAuthResponse } from "@/lib/authNormalizer";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "sonner"
import type { User } from "@/redux/auth/authSlice";
import type { RootState } from "@/redux/store";
import { useNavigate } from "react-router-dom";



interface EditProfilePayload {
  name?: string;
  birthdate: string;
  profile_photo?: string | null;
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
      try {  console.log("Response data:", response);
        const normalizedData = normalizeAuthResponse(response);
        console.log("Normalized data:", normalizedData);


        const mergedData = {
          ...normalizedData,
          token: token as string,
        };

        
        dispatch(loginSuccess(mergedData));
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



interface EditMobileVerifyPayload {
  mobile: string;
}


interface EditMobileVerifyResponse {
  message: string
}

 const editProfileVerify = async (payload: EditMobileVerifyPayload, token:string):Promise<EditMobileVerifyResponse> => {
  console.log("🧾 edit profile verify payload:", payload);
  const {data} = await api.post("/mobile/request-change", payload, {
    headers: { Authorization: `Bearer ${token}` }});
  return data;
}

export const useEditProfileVerify = () => {

  const token = useSelector((state: RootState) => state.auth.token);
  const navigate = useNavigate();


  return useMutation({
    mutationFn:(payload:EditMobileVerifyPayload)=> editProfileVerify(payload, token as string),
    onSuccess: (response) => {
      console.log("✅ Profile edit verification requested successfully:", response);
      toast("✅ Verification code sent to new mobile number!")
      navigate("/new-phone-otp");


    },
    onError: (error) => {
      console.error("❌ Edit profile verification error:", error);
      toast("Edit profile verification failed: An error occurred");
    },
  });
}



interface ChangeMobilePayload {
  otp: string;
  new_mobile: string;
}


interface ChangeMobileResponse {
  message: string
}


export const changeMobile = async (payload: ChangeMobilePayload, token:string):Promise<ChangeMobileResponse> => {
  console.log("🧾 change mobile payload:", payload);
  const {data} = await api.post("/mobile/verify-change", payload, {
    headers: { Authorization: `Bearer ${token}` }});
  return data;
}


export const useChangeMobileHook = () => {

  const token = useSelector((state: RootState) => state.auth.token);
  const navigate = useNavigate();


  return useMutation({
    mutationFn:(payload:ChangeMobilePayload)=> changeMobile(payload, token as string),
    onSuccess: (response) => {
      console.log("✅ Mobile number changed successfully:", response);
      toast("✅ Mobile number changed successfully!")
   
      navigate("/profile-setting");

    },
    onError: (error) => {
      console.error("❌ Change mobile error:", error);
      toast("Change mobile failed: An error occurred");
    },
  });
}