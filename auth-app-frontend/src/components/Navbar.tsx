import { NavLink, useNavigate } from "react-router";
import { Button } from "./ui/button";
import useAuth from "@/services/Store";
import { useEffect, useState } from "react";
import { Moon, Sun, LogOut } from "lucide-react";
import toast from "react-hot-toast";
import { Spinner } from "./ui/spinner";

function Navbar() {
  const checkLogin = useAuth((state) => state.checkLogin);
  const logout = useAuth((state) => state.logout);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem("theme");

    return savedTheme ? savedTheme === "dark" : true;
  });
  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      toast.success("Logged out successfully!");
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const root = document.documentElement;

    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((current: any) => !current);
  };

  return (
    <nav className="py-5 dark:border-b border-gray-700 md:py-0 flex md:flex-row flex-col md:h-14 gap-4 md:gap-0 justify-around items-center">
      <div className="font-semibold flex items-center gap-2">
        <span className="inline-block text-center h-6 w-6 rounded-md bg-linear-to-r from-primary to-primary/40"></span>
        <NavLink to={"/"} className="text-base tracking-tight">
          AuthForge
        </NavLink>
      </div>

      <div className="flex gap-4 items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="cursor-pointer"
        >
          {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>
        {checkLogin() ? (
          <>
            <NavLink to={"/dashboard"}>Dashboard</NavLink>
            <NavLink
              to="/about"
              className="transition-colors hover:text-primary"
            >
              About
            </NavLink>
            <Button
              size={"sm"}
              className={"cursor-pointer"}
              variant={"outline"}
              onClick={() => {
                handleLogout();
                navigate("/");
              }}
            >
              <LogOut />
              {loading ? <Spinner /> : <>Logout</>}
            </Button>
          </>
        ) : (
          <>
            <NavLink to={"/"}>Home</NavLink>
            <NavLink to={"/login"}>
              <Button
                size={"sm"}
                className={"cursor-pointer"}
                variant={"outline"}
              >
                Login
              </Button>
            </NavLink>
            <NavLink to={"/signup"}>
              <Button
                size={"sm"}
                className={"cursor-pointer"}
                variant={"outline"}
              >
                Signup
              </Button>
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
