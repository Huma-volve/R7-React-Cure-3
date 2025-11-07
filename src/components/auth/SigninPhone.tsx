import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useVerifyPhoneLogin } from "@/hooks/auth/useSigninPhone";
import { useDispatch } from "react-redux";
import { setMobile } from "@/redux/auth/signinPhoneSlice";


const schema = z.object({
  phone: z
    .string()
    .min(1, "phone is required")
});


type FormField = z.infer<typeof schema>;


export const SigninPhone = () => {

  const { register, handleSubmit, formState: { errors } } = useForm<FormField>({
    resolver: zodResolver(schema),
  });

  const verifyPhone=useVerifyPhoneLogin();
  const dispatch = useDispatch();

  const onSubmit: SubmitHandler<FormField> = (data) => {
   verifyPhone.mutate({mobile:data.phone});
   dispatch(setMobile(data.phone));
  };

 

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
              placeholder="Phone"
              {...register("phone")}
            />
            {errors.phone && (
              <span className="text-start text-[#fc4b4e] text-sm mt-1 ml-1">
                {errors.phone.message}
              </span>
            )}
          </div>

          <Button
            type="submit"
            className="text-white mt-2 w-full bg-[#145DB8]"
           
          >
            {verifyPhone.isPending ? "Sign in..." : "Sign in"}
          </Button>
        </form>

        <a
          className="block text-[#145DB8] mt-2 text-sm"
          href="/forget-password"
        >
          Forget the password?
        </a>
      </CardContent>
    </Card>
  </div>
  )
}
