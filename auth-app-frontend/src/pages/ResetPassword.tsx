import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  LockKeyhole,
  ShieldCheck,
  CheckCircle2,
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
import { resetPassword } from "@/services/AuthService";

const ResetPassword = () => {
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const resetToken = sessionStorage.getItem("resetToken");

  useEffect(() => {
    if (!resetToken) {
      navigate("/forgot-password");
    }
  }, [resetToken, navigate]);

  const handleSubmit = async (event: React.SubmitEvent) => {
    event.preventDefault();
    setError(null);

    if (newPassword.trim() === "") {
      toast.error("New password is required!");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters!");
      return;
    }

    if (confirmPassword.trim() === "") {
      toast.error("Please confirm your password!");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (!resetToken) {
      navigate("/forgot-password");
      return;
    }

    try {
      setLoading(true);

      await resetPassword(resetToken, newPassword);

      sessionStorage.removeItem("resetToken");
      sessionStorage.removeItem("resetEmail");

      toast.success("Password reset successfully!");

      navigate("/login");
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
                  Reset your password
                </h1>

                <p className="text-sm text-muted-foreground">
                  Create a new password for your account
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
            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="space-y-2"
              >
                <Label htmlFor="newPassword">New password</Label>

                <div className="relative">
                  <LockKeyhole
                    className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />

                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(event) => {
                      setNewPassword(event.target.value);
                      setError(null);
                    }}
                    className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <p className="text-xs text-muted-foreground">
                  Password must contain at least 8 characters.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="space-y-2"
              >
                <Label htmlFor="confirmPassword">Confirm new password</Label>

                <div className="relative">
                  <LockKeyhole
                    className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />

                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(event) => {
                      setConfirmPassword(event.target.value);
                      setError(null);
                    }}
                    className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Button
                  disabled={
                    loading ||
                    newPassword.length < 8 ||
                    confirmPassword.length < 8
                  }
                  type="submit"
                  size="lg"
                  className="w-full cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
                >
                  {loading ? (
                    <>
                      <Spinner />
                      Resetting password...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="size-4" />
                      Reset password
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

export default ResetPassword;
