import { useGoogleLogin } from "@react-oauth/google";
import { Button } from "@/components/ui/button";
import googleIcon from "/google-icon.svg";

export default function GoogleButton() {

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log("Google token:", tokenResponse);
    },
    onError: (err) => {
      console.error("Google login error:", err);
    },
  });

  return (
    <Button
      className="w-full flex items-center justify-center gap-3 border hover:cursor-pointer mt-5 bg-[#4285F4] text-white hover:bg-[#145DB8]"
      onClick={() => login()}
    >
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white">
        <img src={googleIcon} alt="Google logo" className="w-5 h-5" />
      </div>
      Continue with Google
    </Button>
  );
}
