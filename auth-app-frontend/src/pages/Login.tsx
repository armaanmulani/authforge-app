import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  LockKeyhole,
  LogIn,
  ShieldCheck,
  AlertCircleIcon,
} from "lucide-react";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type LoginData from "@/models/LoginData";
import toast from "react-hot-toast";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import useAuth from "@/services/Store";

const Login = () => {
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const navigate = useNavigate();
  const login = useAuth((state) => state.login);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event: React.SubmitEvent) => {
    event.preventDefault();

    //validations
    if (loginData.email.trim() === "") {
      toast.error("Email is required!");
      return;
    }
    if (loginData.password.trim() === "") {
      toast.error("Password is required!");
      return;
    }

    try {
      setLoading(true);
      await login(loginData);
      toast.success("Login Success!");
      navigate("/dashboard");
    } catch (error: any) {
      console.log(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Google OAuth will be implemented later
    console.log("Continue with Google");
  };

  const handleGithubLogin = () => {
    // GitHub OAuth will be implemented later
    console.log("Continue with GitHub");
  };

  return (
    <main className="relative flex min-h-[calc(100vh-73px)] items-center justify-center overflow-hidden px-4 py-12">
      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.7,
          ease: "easeOut",
        }}
        className="w-full max-w-md"
      >
        <Card className="relative overflow-hidden rounded-2xl border-border/50 bg-card/70 shadow-2xl backdrop-blur-xl">
          {/* Top animated glow */}
          <motion.div
            className="absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-primary/70"
            animate={{
              opacity: [0.3, 1, 0.3],
              scaleX: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <CardHeader className="pb-6 pt-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.2,
                duration: 0.5,
              }}
              className="flex items-center gap-4"
            >
              {/* Logo */}
              <motion.div
                animate={{
                  rotate: [0, -5, 5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-border/50 bg-primary/10 text-primary shadow-lg"
              >
                <ShieldCheck className="size-7" />
              </motion.div>

              {/* Heading */}
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Welcome back
                </h1>

                <p className="text-sm text-muted-foreground">
                  Login to your account
                </p>
              </div>
            </motion.div>
          </CardHeader>

          {/* Error */}
          {error && (
            <div className="pl-5 pr-5">
              <Alert variant={"destructive"}>
                <AlertCircleIcon />
                <AlertTitle>
                  {error?.response
                    ? error?.response?.data?.message
                    : error?.message}
                </AlertTitle>
              </Alert>
            </div>
          )}

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.4,
                  duration: 0.5,
                }}
                className="space-y-2"
              >
                <Label htmlFor="email">Email</Label>

                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />

                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={loginData.email}
                    onChange={handleInputChange}
                    className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                    name="email"
                  />
                </div>
              </motion.div>

              {/* Password */}
              <motion.div
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.5,
                  duration: 0.5,
                }}
                className="space-y-2"
              >
                <Label htmlFor="password">Password</Label>

                <div className="relative">
                  <LockKeyhole
                    className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />

                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={handleInputChange}
                    name="password"
                    className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </motion.div>

              {/* Sign In */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.6,
                  duration: 0.5,
                }}
              >
                <Button
                  disabled={loading}
                  type="submit"
                  size="lg"
                  className="w-full cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
                >
                  {loading ? (
                    <>
                      <Spinner />
                      Please wait...
                    </>
                  ) : (
                    <>
                      <LogIn className="size-4" /> Sign in
                    </>
                  )}
                </Button>
              </motion.div>
            </form>

            {/* Divider */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: 0.7,
                duration: 0.5,
              }}
              className="my-6 flex items-center gap-3"
            >
              <Separator className="flex-1" />

              <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                or
              </span>

              <Separator className="flex-1" />
            </motion.div>

            {/* OAuth Buttons */}
            <div className="space-y-3">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.8,
                  duration: 0.5,
                }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="w-full cursor-pointer transition-all duration-300 hover:bg-muted/70"
                  onClick={handleGoogleLogin}
                >
                  <FcGoogle className="size-4" />
                  Continue with Google
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.9,
                  duration: 0.5,
                }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="w-full cursor-pointer transition-all duration-300 hover:bg-muted/70"
                  onClick={handleGithubLogin}
                >
                  <FaGithub className="size-4" />
                  Continue with GitHub
                </Button>
              </motion.div>
            </div>
          </CardContent>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 1,
              duration: 0.5,
            }}
          >
            <CardFooter className="flex items-center justify-between border-t border-border/40 pt-5">
              <Link
                to="/signup"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Create account
              </Link>

              <Link
                to="/forgot-password"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Forgot password?
              </Link>
            </CardFooter>
          </motion.div>
        </Card>

        {/* Security message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 1.2,
            duration: 0.6,
          }}
          className="mt-5 text-center text-xs text-muted-foreground"
        >
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="size-3.5" />
            Your connection is secure
          </span>
        </motion.p>
      </motion.div>
    </main>
  );
};

export default Login;
