import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "sonner"
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";


const editProfile = async (token:string):Promise<{message: string}> => {
  const {data} = await api.post("/delete-account", {
    headers: { Authorization: `Bearer ${token}` }});
  return data;
}

export const useDeleteAccount = () => {
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.auth.token);
  return useMutation({
    mutationFn:()=> editProfile(token as string),
    onSuccess: () => {
        navigate("/account-deleted");
        toast.success("Your account has been deleted successfully.");
    },
    onError: () => {
      toast.error("An error occurred while deleting your account. Please try again.");
    }
  });
}