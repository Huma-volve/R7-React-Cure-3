import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/auth/useLogout";

export const LogoutButton = () => {
  const { mutate: handleLogout, isPending } = useLogout();

  return (
    <Button
      onClick={() => handleLogout()}
      disabled={isPending}
      className="hover:bg-white bg-white text-red-500 border border-red-500 hover:border-red-500 mt-3 !p-6 text-red-500 bold w-[60%] mx-auto"
    >
      {isPending ? "Logging out..." : "Logout"}
    </Button>
  );
};
