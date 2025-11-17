import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { type RootState } from "@/redux/store"; 
import { useChangeMobileHook } from "@/hooks/profile-setting/useEditProfile";
import { loginSuccess } from "@/redux/auth/authSlice";
import { type User } from "@/redux/auth/authSlice";



const schema = z.object({
  otp: z
    .string()
    .length(4, { message: "OTP must be 4 digits" })
});

type OTPForm = z.infer<typeof schema>;

export const EditPhoneOTP = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<OTPForm>({
    resolver: zodResolver(schema),
  });

  const [secondsLeft, setSecondsLeft] = useState<number>(60);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const user = useSelector((state: RootState) => state.auth.user);
const token = useSelector((state: RootState) => state.auth.token);
  const new_mobile = useSelector((state: RootState) => state.newMobile.new_mobile);


  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSecondsLeft(180);

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };


  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  const otpMutation = useChangeMobileHook();
  const dispatch = useDispatch();

  const onSubmit = (data: OTPForm) => {otpMutation.mutate({ new_mobile: new_mobile as string, otp: data.otp });
  dispatch(
    loginSuccess({
      user: {
        ...user as User, 
        mobile: new_mobile!, 
      },
      token: token as string,
    })
  );
}


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white shadow-md rounded-lg p-6 space-y-4"
      >
        
        <h1 className="text-2xl font-semibold text-gray-800 text-center">
          OTP Code Verification
        </h1>
        <p>Code has been sent to your phone</p>
      

        <div className="flex justify-center">
        <Controller
          control={control}
          name="otp"
          render={({ field }) => (
            <InputOTP
              maxLength={4}
              value={field.value}
              onChange={field.onChange}
            >
              <InputOTPGroup >
                <InputOTPSlot className="border border-gray-400" index={0} />
                <InputOTPSlot className="border border-gray-400" index={1} />
                <InputOTPSlot className="border border-gray-400" index={2} />
                <InputOTPSlot className="border border-gray-400" index={3} />
              </InputOTPGroup>
            </InputOTP>
          )}
        /></div>

        <div>
          OTP expires in: {minutes}:{seconds.toString().padStart(2, "0")}
        </div>

 
          <button
            disabled={secondsLeft <= 0}
            type="submit"
            className={`w-full py-2 rounded-md text-sm font-medium ${
              secondsLeft <= 0
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-[#145DB8] text-white hover:bg-[#0F4A91] cursor-pointer"
            }`}
          >
            {otpMutation.isPending ? "Verifying..." : "Verify OTP"}
          </button>
        

        {errors.otp && (
          <span className="text-start text-[#fc4b4e] text-sm mt-1 ml-1">
            {errors.otp.message}
          </span>
        )}
      </form>
    </div>
  );
};
