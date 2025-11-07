import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { useResetPassword } from "@/hooks/auth/useForgetPassword";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { useDispatch } from "react-redux";
import { resetForgotState } from "@/redux/auth/forgotPasswordSlice";


const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 6 characters" })
  .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
  .regex(/[0-9]/, { message: "Password must contain at least one number" })
  .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" });

const schema = z.object({
  password: passwordSchema,
})

type FormField=z.infer<typeof schema>;



export const NewPassword = () => {
  const {register, handleSubmit, formState: { errors }}=useForm<FormField>({
    resolver: zodResolver(schema), 
  });
  const dispatch = useDispatch();
  const email = useSelector((state: RootState) => state.forgetPassword.email);
  const otp = useSelector((state: RootState) => state.forgetPassword.otp);
  
  const resetPasswordMutation = useResetPassword();
  const onSubmit = (data: FormField) => {
    const payload = {
      email,
      otp,
      password: data.password,
    };
  
    resetPasswordMutation.mutate(payload,{onSuccess: () => {
      dispatch(resetForgotState())
    }});
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50  px-4">
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full  max-w-md bg-white shadow-md rounded-lg p-6 space-y-10"
    >
      <h1 className="text-2xl font-semibold text-gray-800 text-center">
       Add New Password
      </h1>

      <div className="flex flex-col">
              <Input className="border border-gray-300" placeholder="new password" {...register("password")} />
              {errors.password && <span className="text-start text-[#fc4b4e] text-sm mt-1 ml-1">{errors.password.message}</span>}
            </div>
     

      <button
        type="submit"
        className="w-full  bg-[#145DB8] text-white py-2 rounded-md text-sm font-medium hover:bg-[#145DB8] hover:cursor-pointer"
      >
        Reset Password
      </button>

    </form>
  </div>
  )
}
