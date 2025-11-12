import { useNavigate } from "react-router-dom";

export const TopNavbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="w-full bg-white dark:bg-gray-900 shadow-md px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
      {/* Logo */}
      <div
        className="cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img
          src="/logo.svg"
          alt="logo"
          className="w-8 h-8 object-contain"
        />
      </div>
    </nav>
  );
}

