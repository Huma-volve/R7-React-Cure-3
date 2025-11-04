import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/useLogout";

export const LogoutButton = () => {
  const { mutate: handleLogout, isPending } = useLogout();

  return (
    <Button
      onClick={() => handleLogout()}
      disabled={isPending}
      className="bg-[#e54447] hover:bg-red-500 mt-3 !p-6 text-white w-[60%] mx-auto"
    >
      {isPending ? "Logging out..." : "Logout"}
    </Button>
  );
};
