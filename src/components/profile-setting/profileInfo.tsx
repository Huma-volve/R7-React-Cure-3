import { MapPin, Camera, CalendarIcon } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { useState, type ChangeEvent } from "react";
import {useForm, type SubmitHandler, Controller} from "react-hook-form";
import {z} from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns"
import { useSelector, useDispatch }  from "react-redux";
import type { RootState } from "@/redux/store";
import { useEditProfile, useEditProfileVerify } from "@/hooks/profile-setting/useEditProfile";
import { setNewMobile } from "@/redux/edit-profile/newPhone";

const birthDate = z
.date({})
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

const schema= z.object({
  email: z.string().email({ message: "Invalid email address" }),
  mobile: z.string().min(10, { message: "Phone number must be at least 10 digits" }),
  name: z.string().min(1, { message: "Name is required" }),
  dob:birthDate,
  profile_photo: z.file().optional(),
})

type FormField=z.infer<typeof schema>;

export const ProfileInfo = () => {
   const [date] = useState<Date | undefined>(
    new Date(2025, 5, 12)
  )
  const [dropdown] =useState<React.ComponentProps<typeof Calendar>["captionLayout"]>(
      "dropdown")

  const [avatar, setAvatar] = useState("/avatar.jpg");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const editProfile = useEditProfile();
  const mobileVerifyProfile = useEditProfileVerify();

      const dispatch = useDispatch();
  const email = useSelector((state: RootState) => state.auth.user?.email);
  const name = useSelector((state: RootState) => state.auth.user?.name);
  const birthDate = useSelector((state: RootState) => state.auth.user?.birthdate);
  const mobile = useSelector((state: RootState) => state.auth.user?.mobile);
  const photo = useSelector((state: RootState) => state.auth.user?.profile_photo);

  const { register, handleSubmit,setValue, formState: { errors }, control } = useForm<FormField>({
    resolver: zodResolver(schema), defaultValues: {
      email: email ,
      name: name ,
      mobile: mobile ,
      dob: birthDate ? new Date(birthDate) : undefined,
      
      
    }
  });

  const onSubmit: SubmitHandler<FormField> = async (data) => {
    const isPhoneChanged = data.mobile !== mobile;
    dispatch(setNewMobile(data.mobile));

    await editProfile.mutateAsync({
      name: data.name,
      birthdate: data.dob.toISOString().split("T")[0],
      profile_photo: data.profile_photo ?? null,
      _method: "PUT",
    });

    if (isPhoneChanged) {
      mobileVerifyProfile.mutate({mobile:mobile as string});
    }

  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file); // save file for upload
      setAvatar(URL.createObjectURL(file)); // preview
      setValue("profile_photo", file); // register with form
    }
  };


  
  return (
   <>
   
   <Card className="bg-white border-0 items-center justify-between p-1 sm:p-2  shadow-none">
      <div className="flex flex-col justify-center items-center relative">
        {/* Avatar Image */}
        <img
          src={avatarFile ? URL.createObjectURL(avatarFile) : photo || avatar}
          width={96}
          height={96}
          className="rounded-full object-cover  border"
        />

       

      
        <div
          className="absolute bottom-13 right-3 bg-white rounded-full p-1 shadow cursor-pointer hover:bg-gray-100 transition"
          onClick={() => document.getElementById("avatarInput")?.click()}
        >
          <Camera className="w-5 h-5 text-gray-700" />
        </div>


        <input
          type="file"
          title="file input"
          id="avatarInput"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />


      
        <div className="flex flex-col items-center mt-2">
          <p className="p-1 text-base font-semibold text-foreground">{name}</p>
          <div className="flex items-center text-sm text-muted-foreground mt-0.5">
            <MapPin className="w-4 h-4 mr-1" />
            <span>San Francisco, CA</span>
          </div>
        </div>
      </div>
    </Card>

    <Card className="bg-white shadow-none border-0 w-full max-w-md flex justify-center mx-auto">
        <CardContent >
          <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col">
              <Input className="border-0 bg-gray-200" {...register("name")} />
              {errors.name && <span className="text-start text-[#fc4b4e] text-sm mt-1 ml-1">{errors.name.message}</span>}
            </div>

            <div className="flex flex-col">
              <Input disabled className="border-0 bg-gray-300"  type="email" {...register("email")} />
              {errors.email && <span className="text-start text-[#fc4b4e] text-sm mt-1 ml-1">{errors.email.message}</span>}
            </div>


          
         <div className="flex flex-col">
              <Input className="border-0 bg-gray-200"  {...register("mobile")} />
              {  errors.mobile && <span className="text-start text-[#fc4b4e] text-sm mt-1 ml-1">{errors.mobile.message}</span>}
            </div>
        
           

            <div className="flex flex-col">
    <Controller
        control={control} 
        name="dob"       
        render={({ field }) => (
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        className={`border text-black w-full justify-start text-left font-normal bg-gray-300 hover:bg-gray-400 hover:cursor-pointer ${!field.value && "text-black"}`}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP") : <span>{birthDate}</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-50 bg-white shadow-lg rounded-md border-0">
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
  
    {errors.dob && <span className="text-start text-[#fc4b4e] text-sm mt-1 ml-1">{errors.dob.message}</span>}
</div>


            <Button disabled={editProfile.isPending} type="submit" className="text-white mt-2 w-full bg-[#145DB8] hover:bg-[#145DB8] hover:cursor-pointer">{editProfile.isPending?"Editing...":"Edit profile"}</Button>
          </form>

        </CardContent>
      </Card>
   </>
  )
}
