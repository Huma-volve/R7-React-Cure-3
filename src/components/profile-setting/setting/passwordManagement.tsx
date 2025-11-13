import {useForm} from "react-hook-form";
import {z} from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChangePassword } from "@/hooks/profile-setting/useChangePassword";


const passwordSchema = z
  .string()
  .min(6, { message: "Password must be at least 6 characters" })
  .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
  .regex(/[0-9]/, { message: "Password must contain at least one number" })
  .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" });

const schema = z.object({
current_password: passwordSchema,
password: passwordSchema,
confirmNewPassword: z.string(),
}).refine((data) => data.password === data.confirmNewPassword , {message: "Passwords do not match"}
);

type FormField=z.infer<typeof schema>;

export const PasswordManagement = () => {
  const changePasswordMutation = useChangePassword();

  const {register, handleSubmit, formState: { errors }}=useForm<FormField>({resolver: zodResolver(schema),});
  
// Inside PasswordManagement.tsx

const onSubmit = (data: FormField) => {
  changePasswordMutation.mutate({
      current_password: data.current_password, 
      password: data.password,
      _method: "PUT",
    });
  
};

  return (
    <div >
      
    <Card className="w-full max-w-md border-0 bg-white">
      <CardHeader>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col">
            <Input className="border-gray-400" placeholder="Current password" {...register("current_password")} />
            {errors.current_password && <span className="text-start text-[#fc4b4e] text-sm mt-1 ml-1">{errors.current_password.message}</span>}
          </div>

        
          <div className="flex flex-col">
            <Input className="border-gray-400" placeholder="New password" type="password" {...register("password")} />
            {errors.password && <span className="text-start text-[#fc4b4e] text-sm mt-1 ml-1">{errors.password.message}</span>}
          </div>

          
          <div className="flex flex-col">
            <Input className="border-gray-400" placeholder="Confirm new password" type="password" {...register("confirmNewPassword")} />
            {errors.confirmNewPassword && <span className="text-start text-[#fc4b4e] text-sm mt-1 ml-1">{errors.confirmNewPassword.message}</span>}
            </div>
        


          <Button disabled={ changePasswordMutation.isPending} type="submit" className="text-white mt-2 w-full bg-[#145DB8] hover:bg-[#145DB8] hover:cursor-pointer">{changePasswordMutation.isPending? "Change Password...":"Change Password"}</Button>
        </form>
      
      </CardContent>
    </Card>
  </div>
  )
}
