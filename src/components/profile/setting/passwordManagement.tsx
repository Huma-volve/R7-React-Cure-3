import {useForm, type SubmitHandler, Controller} from "react-hook-form";
import {z} from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


const passwordSchema = z
  .string()
  .min(6, { message: "Password must be at least 6 characters" })
  .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
  .regex(/[0-9]/, { message: "Password must contain at least one number" })
  .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" });

const schema = z.object({
currentPassword: passwordSchema,
newPassword: passwordSchema,
confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword , {message: "Passwords do not match"}
);

type FormField=z.infer<typeof schema>;

export const PasswordManagement = () => {
  const {register, handleSubmit, formState: { errors }}=useForm<FormField>({resolver: zodResolver(schema),});
  const onSubmit: SubmitHandler<FormField> = data => console.log(data);

  return (
    <div >
      
    <Card className="w-full max-w-md border-0">
      <CardHeader>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col">
            <Input placeholder="Current password" {...register("currentPassword")} />
            {errors.currentPassword && <span className="text-start text-[#fc4b4e] text-sm mt-1 ml-1">{errors.currentPassword.message}</span>}
          </div>

        
          <div className="flex flex-col">
            <Input placeholder="New password" type="password" {...register("newPassword")} />
            {errors.newPassword && <span className="text-start text-[#fc4b4e] text-sm mt-1 ml-1">{errors.newPassword.message}</span>}
          </div>

          
          <div className="flex flex-col">
            <Input placeholder="Confirm new password" type="password" {...register("confirmNewPassword")} />
            {errors.confirmNewPassword && <span className="text-start text-[#fc4b4e] text-sm mt-1 ml-1">{errors.confirmNewPassword.message}</span>}
            </div>
        


          <Button type="submit" className="text-white mt-2 w-full bg-[#145DB8] hover:bg-[#145DB8] hover:cursor-pointer">Sign In</Button>
        </form>
      
      </CardContent>
    </Card>
  </div>
  )
}
