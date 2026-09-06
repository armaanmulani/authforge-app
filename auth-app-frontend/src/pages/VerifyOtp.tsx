import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ShieldCheck,
  KeyRound,
  AlertCircleIcon,
  RotateCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import toast from "react-hot-toast";
import { verifyOtp } from "@/services/AuthService";

const VerifyOtp = () => {
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(60);

  const email = sessionStorage.getItem("resetEmail");

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleOtpChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
    setError(null);
  };

  const handleSubmit = async (event: React.SubmitEvent) => {
    event.preventDefault();
    setError(null);

    if (otp.length !== 6) {
      toast.error("Please enter the 6-digit verification code!");
      return;
    }

    if (!email) {
      navigate("/forgot-password");
      return;
    }

    try {
      setLoading(true);

      const resetToken = await verifyOtp(email, otp);

      sessionStorage.setItem("resetToken", resetToken);

      toast.success("OTP verified successfully!");

      navigate("/reset-password");
    } catch (error: any) {
      console.log(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    // Resending will be implemented through the forgot-password flow.
    navigate("/forgot-password");
  };

  return (
    <main className="relative flex min-h-[calc(100vh-73px)] items-center justify-center overflow-hidden px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="relative overflow-hidden rounded-2xl border-border/50 bg-card/70 shadow-2xl backdrop-blur-xl">
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
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex items-center gap-4"
            >
              <motion.div
                animate={{ rotate: [0, -5, 5, 0] }}
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
                  Verify your email
                </h1>

                <p className="text-sm text-muted-foreground">
                  Enter the 6-digit code we sent you
                </p>
              </div>
            </motion.div>
          </CardHeader>

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
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-center">
                  <KeyRound className="mr-2 size-4 text-muted-foreground" />

                  <p className="text-sm text-muted-foreground">
                    Code sent to{" "}
                    <span className="font-medium text-foreground">{email}</span>
                  </p>
                </div>

                <Input
                  id="otp"
                  name="otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  placeholder="000000"
                  value={otp}
                  onChange={handleOtpChange}
                  className="h-14 text-center text-2xl font-semibold tracking-[0.5em] transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                  autoFocus
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <Button
                  disabled={loading || otp.length !== 6}
                  type="submit"
                  size="lg"
                  className="w-full cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
                >
                  {loading ? (
                    <>
                      <Spinner />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="size-4" />
                      Verify code
                    </>
                  )}
                </Button>
              </motion.div>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="mt-6 text-center"
            >
              {timeLeft > 0 ? (
                <p className="text-sm text-muted-foreground">
                  Didn't receive the code? Resend in{" "}
                  <span className="font-medium text-foreground">
                    {timeLeft}s
                  </span>
                </p>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleResend}
                  className="cursor-pointer"
                >
                  <RotateCw className="size-4" />
                  Request a new code
                </Button>
              )}
            </motion.div>
          </CardContent>

          <CardFooter className="border-t border-border/40 pt-5">
            <Link
              to="/forgot-password"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              Change email
            </Link>
          </CardFooter>
        </Card>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
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

export default VerifyOtp;
