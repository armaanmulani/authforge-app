import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  ArrowLeft,
  ShieldCheck,
  Send,
  AlertCircleIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";

import toast from "react-hot-toast";
import { forgotPassword } from "@/services/AuthService";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const handleSubmit = async (event: React.SubmitEvent) => {
    event.preventDefault();

    setError(null);

    if (email.trim() === "") {
      toast.error("Email is required!");
      return;
    }

    try {
      setLoading(true);

      await forgotPassword(email.trim());

      sessionStorage.setItem("resetEmail", email.trim());

      toast.success("Verification code sent!");

      navigate("/verify-otp");
    } catch (error: any) {
      console.log(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-[calc(100vh-73px)] items-center justify-center overflow-hidden px-4 py-12">
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

              <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Forgot password?
                </h1>

                <p className="text-sm text-muted-foreground">
                  We'll send you a verification code
                </p>
              </div>
            </motion.div>
          </CardHeader>

          {/* Error */}
          {error && (
            <div className="px-5">
              <Alert variant="destructive">
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
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                    name="email"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.5,
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
                      Sending code...
                    </>
                  ) : (
                    <>
                      <Send className="size-4" />
                      Send verification code
                    </>
                  )}
                </Button>
              </motion.div>
            </form>
          </CardContent>

          <CardFooter className="border-t border-border/40 pt-5">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              Back to login
            </Link>
          </CardFooter>
        </Card>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 0.8,
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

export default ForgotPassword;
