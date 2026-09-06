import { NavLink, useNavigate } from "react-router";
import { Button } from "./ui/button";
import useAuth from "@/services/Store";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

function Navbar() {
  const checkLogin = useAuth((state) => state.checkLogin);
  const user = useAuth((state) => state.user);
  const logout = useAuth((state) => state.logout);
  const navigate = useNavigate();

  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

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
            <NavLink to={"#"}>{user?.name}</NavLink>
            <Button
              size={"sm"}
              className={"cursor-pointer"}
              variant={"outline"}
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              Logout
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
