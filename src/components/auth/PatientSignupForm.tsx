import {useForm, type SubmitHandler, Controller} from "react-hook-form";
import {z} from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import googleIcon from "/google-icon.svg";
import { format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { PhoneInput } from "./phone-input";
import { useSignup } from "@/hooks/auth/useSignup";


const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 6 characters" })
  .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
  .regex(/[0-9]/, { message: "Password must contain at least one number" })
  .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" });

  const birthDate = z
  .date({
    message: "Please select a date of birth.", 
  })
  .refine((date) => {
    const today = new Date();
    const eighteenYearsAgo = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );

    return date <= eighteenYearsAgo;
  }, {
    message: "You must be at least 18 years old.",
  });


const schema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  mobile: z.string().min(10, { message: "Phone number is too short" })
            .max(15, { message: "Phone number is too long" }),
            birthdate: birthDate,
  password: passwordSchema,
  confirmPassword: z.string(),
  gender:z.enum(["male", "female"]).optional(),
  privacyPolicy: z.boolean().refine(val => val === true, {
    message: "You must agree to the Privacy Policy",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords must match",
  path: ["confirmPassword"],
});


type FormField=z.infer<typeof schema>;

export const PatientSignupForm = () => {
  const [date] = useState<Date | undefined>(
    new Date(2025, 5, 12)
  )
  const [dropdown] =useState<React.ComponentProps<typeof Calendar>["captionLayout"]>(
      "dropdown"
    )



  const {register,control, handleSubmit, formState: { errors }}=useForm<FormField>({
    resolver: zodResolver(schema), 
  });
  const signupMutation = useSignup();
  const onSubmit: SubmitHandler<FormField> = (data) => {
    const { privacyPolicy,confirmPassword, ...rest } = data; 
  
    const formattedData = {
      ...rest,
      birthdate: format(rest.birthdate, "yyyy-MM-dd"),
      mobile: data.mobile.replace(/^\+20/, "0"), 
    };
  
    signupMutation.mutate(formattedData);
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      
      <Card className="w-full max-w-md shadow-lg bg-white">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Create new account</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col">
              <Input className="border border-gray-300" placeholder="Name" {...register("name")} />
              {errors.name && <span className="text-start text-[#fc4b4e] text-sm mt-1 ml-1">{errors.name.message}</span>}
            </div>

            <div className="flex flex-col">
              <Input className="border border-gray-300" placeholder="Email" type="email" {...register("email")} />
              {errors.email && <span className="text-start text-[#fc4b4e] text-sm mt-1 ml-1">{errors.email.message}</span>}
            </div>

            <div className="flex flex-col border border-gray-300">
            <Controller
  control={control}
  name="mobile"
  render={({ field }) => (
    <PhoneInput
      {...field}               
      className="bg-white"
      defaultCountry="EG"
      placeholder="01**********"
    />
  )}
/>
              {errors.mobile && <span className="text-start text-[#fc4b4e] text-sm mt-1 ml-1">{errors.mobile.message}</span>}
            </div>

            <div className="flex flex-col">
    <Controller
        control={control} 
        name="birthdate"       
        render={({ field }) => (
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={`w-full justify-start text-left font-normal ${!field.value && "text-muted-foreground"}`}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP") : <span>Select date of birth</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-50 bg-white shadow-lg rounded-md">
                    <Calendar
                        mode="single"
                        defaultMonth={date}
                        selected={field.value}
                        onSelect={field.onChange} 
                        disabled={(date: Date) => date > new Date() || date < new Date("1900-01-01")}
                        captionLayout={dropdown}
                    />
                </PopoverContent>
            </Popover>
        )}
    />
    {/* Display error message if it exists */}
    {errors.birthdate && <span className="text-start text-[#fc4b4e] text-sm mt-1 ml-1">{errors.birthdate.message}</span>}
</div>



<div className="flex flex-col space-y-2">
  <Label htmlFor="gender">Gender</Label>

  <Controller
    control={control}
    name="gender"
    render={({ field }) => (
      <Select onValueChange={field.onChange} defaultValue={field.value}>
        <SelectTrigger
          className={cn(
            "bg-gray-100 border-0 focus:ring-2 focus:ring-blue-500",
            errors.gender && "border-red-500 focus:ring-red-500"
          )}
        >
          <SelectValue placeholder="Select gender" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="male">Male</SelectItem>
          <SelectItem value="female">Female</SelectItem>
        </SelectContent>
      </Select>
    )}
  />

  {errors.gender && (
    <span className="text-start text-[#fc4b4e] text-sm mt-1 ml-1">
      {errors.gender.message}
    </span>
  )}
</div>

            <div className="flex flex-col">
              <Input className="flex flex-col border border-gray-300" placeholder="Password" type="password" {...register("password")} />
              {errors.password && <span className="text-start text-[#fc4b4e] text-sm mt-1 ml-1">{errors.password.message}</span>}
            </div>

            <div className="flex flex-col">
              <Input className="flex flex-col border border-gray-300" placeholder="Confirm Password" type="password" {...register("confirmPassword")} />
              {errors.confirmPassword && <span className="text-start text-[#fc4b4e] text-sm mt-1 ml-1">{errors.confirmPassword.message}</span>}
            </div>

            <div className="flex flex-col">
              <div className="flex gap-2">
            <input {...register("privacyPolicy")} type="checkbox" />
           <label className="text-sm">I agree to the <a href="#" className="text-[#145DB8]">Terms of Service</a> and <a href="#"  className="text-[#145DB8]">Privacy Policy</a></label></div>
           {errors.privacyPolicy && <span className="text-start text-[#fc4b4e] text-sm ml-1">{errors.privacyPolicy.message}</span>}
            </div>
          


            <Button type="submit" className="mt-2 w-full bg-[#145DB8] hover:bg-[#145DB8] hover:cursor-pointer"
             disabled={signupMutation.isPending}
            >{signupMutation.isPending?"Signing in":"Sign up"}</Button>
          </form>
          <a 
  href="https://accounts.google.com/v3/signin/accountchooser?dsh=S2064670113%3A1762466372533891&elo=1&ifkv=ARESoU1kk6R-3OWzfij6pvamMf042bcBE0T330AKbfPOnuiw7RIr6Sy0kbR_GCwEro9z3BiMY2vLhQ&flowName=GlifWebSignIn&flowEntry=ServiceLogin"
  target="_blank"
  rel="noopener noreferrer"
>
  <Button className="w-full flex items-center justify-center gap-2 border hover:cursor-pointer mt-5 bg-[#ffffff] hover:bg-[#ffffff] text-black">
    <img src={googleIcon} alt="Google logo" className="w-5 h-5" />
    Sign Up with Google
  </Button>
</a>


        </CardContent>
      </Card>
    </div>
  )
}
