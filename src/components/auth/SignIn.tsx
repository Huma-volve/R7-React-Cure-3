import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useLogin } from "@/hooks/auth/useLogin"; 
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "@/redux/store";
import { useEffect } from "react";
import GoogleButton from "./GoogleButton";


const passwordSchema = z
  .string()
  // .min(8, { message: "Password must be at least 8 characters" })
  // .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
  // .regex(/[0-9]/, { message: "Password must contain at least one number" })
  // .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" });

const schema = z.object({
  email: z
    .string()
    .min(1, "Email is required").trim()
    .refine(
      (val) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\+?[0-9]{10,15}$/;
        return emailRegex.test(val) || phoneRegex.test(val);
      },
      {
        message: "Must be a valid email or phone number",
      }
    ),
  password: passwordSchema,
});

type FormField = z.infer<typeof schema>;

export const SignIn = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormField>({
    resolver: zodResolver(schema),
  });

  const loginMutation = useLogin();

  const onSubmit: SubmitHandler<FormField> = (data) => {
    loginMutation.mutate(data);
  };

  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    if (user) {
      navigate("/"); 
    }
  }, [user, navigate]);


  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md shadow-lg bg-white">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Sign in</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col">
              <Input
                className="border border-gray-300"
                placeholder="Email"
                {...register("email")}
              />
              {errors.email && (
                <span className="text-start text-[#fc4b4e] text-sm mt-1 ml-1">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <Input
                className="border border-gray-300"
                placeholder="Password"
                type="password"
                {...register("password")}
              />
              {errors.password && (
                <span className="text-start text-[#fc4b4e] text-sm mt-1 ml-1">
                  {errors.password.message}
                </span>
              )}
            </div>

            <Button
              type="submit"
              className="text-white mt-2 w-full bg-[#145DB8]"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Logging in..." : "Sign In"}
            </Button>
          </form>
          <a href="/signin-phone">
  <Button className="text-black mt-2 w-full bg-white hover:bg-white border border-[#145DB8] hover:cursor-pointer">
    Sign in with phone number
  </Button>
</a>

  <div className="flex justify-center mt-3">
  <p className="text-sm text-gray-600">
    Don’t have an account?{" "}
    <a
      href="/signup"
      className="text-[#145DB8] font-medium hover:underline"
    >
      Sign up
    </a>
  </p>
</div>

<GoogleButton />

<a
  className="block text-[#145DB8] mt-3 text-sm  hover:underline"
  href="/forget-password"
>
  Forgot your password?
</a>
        </CardContent>
      </Card>
    </div>
  );
};
