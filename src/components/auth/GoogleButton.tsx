import { GoogleLogin } from "@react-oauth/google";
import { useGoogle } from "@/hooks/auth/useGoogle"; 

export default function GoogleButton() {
  const loginMutation = useGoogle();
  return (
    <div className="w-full mt-5 flex justify-center">
      <div
        className="w-full max-w-sm"
        style={{ display: "flex", justifyContent: "center" }}
      >
       <GoogleLogin
  onSuccess={(res) => {
    const idToken = res.credential; // Type: string | undefined

    if (idToken) {
      console.log("Google ID Token:", idToken);
      
      // TypeScript now knows 'idToken' is a string.
      // We construct the object payload expected by the mutation.
      const payload = {
        token: idToken 
      };
      
      loginMutation.mutate(payload); // Safe to call
    } else {
      // Handle the unexpected case where the credential is missing
      console.error("❌ Google response missing ID token.");
      // You might want to show a user-facing error here (e.g., using toast)
    }
  }}
  onError={() => {
    console.log("Google Login Failed");
  }}
  size="medium"
/>
      </div>
    </div>
  );
}
