import {useForm, type SubmitHandler, Controller} from "react-hook-form";
import {z} from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import googleIcon from "/google-icon.svg";
import { format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react";
import { useState } from "react";


const passwordSchema = z
  .string()
  .min(6, { message: "Password must be at least 6 characters" })
  .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
  .regex(/[0-9]/, { message: "Password must contain at least one number" })
  .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" });

  const birthDate = z
  .date({
    message: "Please select a date of birth.", // Error if no date is selected
  })
  .refine((date) => {
    const today = new Date();
    const eighteenYearsAgo = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );
    // Check if the selected date is on or before the date 18 years ago
    return date <= eighteenYearsAgo;
  }, {
    message: "You must be at least 18 years old.",
  });


const schema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  phone: z.string().min(10, { message: "Phone number is too short" })
            .max(15, { message: "Phone number is too long" }),
            dob: birthDate,
  password: passwordSchema,
  confirmPassword: z.string(),
  privacyPolicy: z.boolean().refine(val => val === true, {
    message: "You must agree to the Privacy Policy",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords must match",
  path: ["confirmPassword"],
});


type FormField=z.infer<typeof schema>;

export const PatientSignupForm = () => {
<<<<<<< HEAD
  const [date, setDate] = useState<Date | undefined>(
    new Date(2025, 5, 12)
  )
  const [dropdown, setDropdown] =useState<React.ComponentProps<typeof Calendar>["captionLayout"]>(
=======
  const [date] = useState<Date | undefined>(
    new Date(2025, 5, 12)
  )
  const [dropdown] =useState<React.ComponentProps<typeof Calendar>["captionLayout"]>(
>>>>>>> fe1188d963ea9d511a96bff6e08390d4e5502df4
      "dropdown"
    )



  const {register,control, handleSubmit, formState: { errors }}=useForm<FormField>({
    resolver: zodResolver(schema), 
  });
  const onSubmit: SubmitHandler<FormField> = data => console.log(data);
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Create new account</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col">
              <Input placeholder="Name" {...register("name")} />
              {errors.name && <span className="text-start text-[#fc4b4e] text-sm mt-1 ml-1">{errors.name.message}</span>}
            </div>

            <div className="flex flex-col">
              <Input placeholder="Email" type="email" {...register("email")} />
              {errors.email && <span className="text-start text-[#fc4b4e] text-sm mt-1 ml-1">{errors.email.message}</span>}
            </div>

            <div className="flex flex-col">
              <Input placeholder="Phone" {...register("phone")} />
              {errors.phone && <span className="text-start text-[#fc4b4e] text-sm mt-1 ml-1">{errors.phone.message}</span>}
            </div>

            <div className="flex flex-col">
    <Controller
        control={control} 
        name="dob"       
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
                        onSelect={field.onChange} // Crucial: This calls React Hook Form's onChange
<<<<<<< HEAD
                        disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
=======
                        disabled={(date: Date) => date > new Date() || date < new Date("1900-01-01")}
>>>>>>> fe1188d963ea9d511a96bff6e08390d4e5502df4
                        captionLayout={dropdown}
                    />
                </PopoverContent>
            </Popover>
        )}
    />
    {/* Display error message if it exists */}
    {errors.dob && <span className="text-start text-[#fc4b4e] text-sm mt-1 ml-1">{errors.dob.message}</span>}
</div>

            <div className="flex flex-col">
              <Input placeholder="Password" type="password" {...register("password")} />
              {errors.password && <span className="text-start text-[#fc4b4e] text-sm mt-1 ml-1">{errors.password.message}</span>}
            </div>

            <div className="flex flex-col">
              <Input placeholder="Confirm Password" type="password" {...register("confirmPassword")} />
              {errors.confirmPassword && <span className="text-start text-[#fc4b4e] text-sm mt-1 ml-1">{errors.confirmPassword.message}</span>}
            </div>

            <div className="flex flex-col">
              <div className="flex gap-2">
            <input type="checkbox" {...register("privacyPolicy")} />
           <label className="text-sm">I agree to the <a href="#" className="text-[#145DB8]">Terms of Service</a> and <a href="#"  className="text-[#145DB8]">Privacy Policy</a></label></div>
           {errors.privacyPolicy && <span className="text-start text-[#fc4b4e] text-sm ml-1">{errors.privacyPolicy.message}</span>}
            </div>
          


            <Button type="submit" className="mt-2 w-full bg-[#145DB8] hover:bg-[#145DB8] hover:cursor-pointer">Sign Up</Button>
          </form>
          <Button className="w-full flex items-center justify-center gap-2 border hover:cursor-pointer mt-5  bg-[#ffffff] hover:bg-[#ffffff] text-color-black">
  <img src={googleIcon} alt="Google logo" className="w-5 h-5"/>
  Sign Up with Google
</Button>

        </CardContent>
      </Card>
    </div>
  )
}
