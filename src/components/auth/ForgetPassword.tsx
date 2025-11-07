import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForgetPassword } from "@/hooks/auth/useForgetPassword";
import { useDispatch } from "react-redux";
import {setEmail} from "@/redux/auth/forgotPasswordSlice";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export const ForgetPasswordComp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({ resolver: zodResolver(forgotPasswordSchema),});

  const otpMutation = useForgetPassword();
  const dispatch = useDispatch();
  const onSubmit = (data: ForgotPasswordForm) => {
    otpMutation.mutate(data);
    dispatch(setEmail(data.email));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white shadow-md rounded-lg p-6 space-y-4"
      >
        <h1 className="text-2xl font-semibold text-gray-800 text-center">
          Forgot Password
        </h1>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            {...register("email")}
            placeholder="Enter your email"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full  bg-[#145DB8] text-white py-2 rounded-md text-sm font-medium hover:bg-[#145DB8] hover:cursor-pointer"
        >
          Reset Password
        </button>

        <p className="text-center text-sm text-gray-600 mt-2">
          Remember your password?{" "}
          <a
            href="signin"
            className="text-[#145DB8] text-sm"
          >
            Log in
          </a>
        </p>
      </form>
    </div>
  );
};
