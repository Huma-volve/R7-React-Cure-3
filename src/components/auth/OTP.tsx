import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useEffect, useState, useRef } from "react";

const schema = z.object({
  otp: z
    .string()
    .length(6, { message: "OTP must be 6 digits" })
    .refine((val) => val === "123456", { message: "OTP is wrong" }),
});

type OTPForm = z.infer<typeof schema>;

export const OTP = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<OTPForm>({
    resolver: zodResolver(schema),
  });

  const [secondsLeft, setSecondsLeft] = useState<number>(60);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);



  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSecondsLeft(60);

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

  const onSubmit = (data: OTPForm) => console.log(data);

  const handleResend = () => {
    startTimer(); 
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white shadow-md rounded-lg p-6 space-y-4"
      >
        <h1 className="text-2xl font-semibold text-gray-800 text-center">
          OTP Code Verification
        </h1>
        <p>Code has been sent to +02 010 *** **88</p>

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

        {secondsLeft <= 0 ? (
          <button
            type="button"
            onClick={handleResend}
            className="w-full py-2 rounded-md text-sm font-medium bg-[#145DB8] text-white hover:bg-[#0F4A91] cursor-pointer"
          >
            Resend OTP
          </button>
        ) : (
          <button
            disabled={secondsLeft <= 0}
            type="submit"
            className={`w-full py-2 rounded-md text-sm font-medium ${
              secondsLeft <= 0
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-[#145DB8] text-white hover:bg-[#0F4A91] cursor-pointer"
            }`}
          >
            Verify
          </button>
        )}

        {errors.otp && (
          <span className="text-start text-[#fc4b4e] text-sm mt-1 ml-1">
            {errors.otp.message}
          </span>
        )}
      </form>
    </div>
  );
};
