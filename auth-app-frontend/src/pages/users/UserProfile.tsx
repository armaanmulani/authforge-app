import { useEffect, useState } from "react";

import { motion, AnimatePresence } from "framer-motion";

import {
  AlertCircleIcon,
  Camera,
  Check,
  Edit3,
  Lock,
  Mail,
  ShieldCheck,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Alert, AlertTitle } from "@/components/ui/alert";

import useAuth from "@/services/Store";

import { deleteUser, logoutUser } from "@/services/AuthService";

import toast from "react-hot-toast";

import { useNavigate } from "react-router";

export default function UserProfile() {
  const user = useAuth((state) => state.user);
  const logout = useAuth((state) => state.logout);

  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<any>(null);

  /*
   * Only fields that are actually editable from the User model.
   */
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    image: "",
  });

  /*
   * Sync local profile state whenever the Zustand user changes.
   */
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name ?? "",
        email: user.email,
        image: user.image ?? "",
      });
    }
  }, [user]);

  /*
   * Update editable fields.
   */
  const handleChange = (field: keyof typeof profile, value: string) => {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));
  };

  /*
   * Enter edit mode.
   */
  const handleStartEditing = () => {
    if (!user) return;

    setProfile({
      name: user.name ?? "",
      email: user.email,
      image: user.image ?? "",
    });

    setIsEditing(true);
    setError(null);
  };

  /*
   * Cancel editing and restore original values.
   */
  const handleCancelEditing = () => {
    if (user) {
      setProfile({
        name: user.name ?? "",
        email: user.email,
        image: user.image ?? "",
      });
    }

    setIsEditing(false);
    setError(null);
  };

  /*
   * Save profile.
   *
   * Backend integration will be added later.
   */
  const handleSaveProfile = () => {
    console.log("Updated profile:", profile);

    toast.success("Profile updated successfully!");

    setIsEditing(false);
  };

  /*
   * Profile picture selection.
   *
   * This only creates a local preview for now.
   * Backend upload can be added later.
   */
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        handleChange("image", reader.result);
      }
    };

    reader.readAsDataURL(file);
  };

  /*
   * Generate avatar initials.
   */
  const getInitials = (name?: string) => {
    if (!name?.trim()) return "U";

    return name
      .trim()
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  /*
   * Delete account.
   */
  const handleDeleteAccount = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      await deleteUser(user.id);

      await logout();

      toast.success("Account permanently deleted!");

      navigate("/");
    } catch (error: any) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-background px-4 py-10 text-foreground">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        {/* ==================== PAGE HEADER ==================== */}

        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold tracking-tight">User Profile</h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Manage your account information and settings.
          </p>
        </motion.div>

        {/* ==================== ERROR ==================== */}

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Alert variant="destructive">
                <AlertCircleIcon />

                <AlertTitle>
                  {error?.response
                    ? error?.response?.data?.message
                    : error?.message}
                </AlertTitle>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ==================== PROFILE CARD ==================== */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.1,
          }}
        >
          <Card className="border-border/60 bg-card/70 shadow-xl backdrop-blur-xl">
            {/* Header */}

            <CardHeader className="border-b border-border/50">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-xl">Profile Information</CardTitle>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {isEditing
                      ? "Update your personal information."
                      : "View your account information."}
                  </p>
                </div>

                {!isEditing && (
                  <Button
                    type="button"
                    variant="outline"
                    className="cursor-pointer"
                    onClick={handleStartEditing}
                  >
                    <Edit3 className="size-4" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-7 pt-7">
              {/* ==================== AVATAR ==================== */}

              <motion.div layout className="flex flex-col items-center gap-3">
                <div className="relative">
                  <Avatar className="size-28 border border-border shadow-lg">
                    <AvatarImage
                      src={profile.image || undefined}
                      alt={profile.name || "User"}
                    />

                    <AvatarFallback className="bg-primary/10 text-2xl text-primary">
                      {getInitials(profile.name)}
                    </AvatarFallback>
                  </Avatar>

                  {/* Camera button only in edit mode */}

                  {isEditing && (
                    <>
                      <label
                        htmlFor="profile-picture"
                        className="absolute bottom-0 right-0 flex size-9 cursor-pointer items-center justify-center rounded-full border border-border bg-background shadow-md transition-all hover:bg-accent hover:scale-105"
                      >
                        <Camera className="size-4" />
                      </label>

                      <input
                        id="profile-picture"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </>
                  )}
                </div>

                {isEditing && (
                  <p className="text-xs text-muted-foreground">
                    Click the camera icon to change your picture.
                  </p>
                )}
              </motion.div>

              {/* ==================== PROFILE FIELDS ==================== */}

              <div className="grid gap-5 md:grid-cols-2">
                {/* Name */}

                <div className="space-y-2">
                  <Label htmlFor="full-name">Full Name</Label>

                  <div className="relative">
                    <UserRound className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      id="full-name"
                      value={profile.name}
                      disabled={!isEditing}
                      onChange={(event) =>
                        handleChange("name", event.target.value)
                      }
                      placeholder="Your name"
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Email */}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>

                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      disabled={!isEditing}
                      onChange={(event) =>
                        handleChange("email", event.target.value)
                      }
                      placeholder="you@example.com"
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Provider */}

                <div className="space-y-2">
                  <Label htmlFor="provider">Authentication Provider</Label>

                  <div className="relative">
                    <ShieldCheck className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      id="provider"
                      value={user?.provider ?? "Unknown"}
                      disabled
                      className="pl-10 uppercase"
                    />
                  </div>
                </div>

                {/* Account Status */}

                <div className="space-y-2">
                  <Label>Account Status</Label>

                  <div className="flex h-10 items-center rounded-md border border-border bg-muted/30 px-3">
                    <span
                      className={`inline-flex items-center gap-2 text-sm font-medium ${
                        user?.enabled ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      <span
                        className={`size-2 rounded-full ${
                          user?.isEnabled ? "bg-primary" : "bg-muted-foreground"
                        }`}
                      />

                      {user?.isEnabled ? "Active" : "Disabled"}
                    </span>
                  </div>
                </div>
              </div>

              {/* ==================== EDIT ACTIONS ==================== */}

              <AnimatePresence mode="wait">
                {isEditing && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      y: -10,
                    }}
                    className="flex gap-3 border-t border-border/50 pt-5"
                  >
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 cursor-pointer"
                      onClick={handleCancelEditing}
                    >
                      <X className="size-4" />
                      Cancel
                    </Button>

                    <Button
                      type="button"
                      className="flex-1 cursor-pointer"
                      onClick={handleSaveProfile}
                    >
                      <Check className="size-4" />
                      Save Profile
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* ==================== ACCOUNT SETTINGS ==================== */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.2,
          }}
        >
          <Card className="border-border/60 bg-card/70 shadow-xl backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-xl">Account Settings</CardTitle>

              <p className="text-sm text-muted-foreground">
                Manage your account security and access.
              </p>
            </CardHeader>

            <CardContent className="space-y-3">
              {/* Change Password */}

              <Button
                type="button"
                variant="outline"
                className="w-full cursor-pointer justify-center"
              >
                <Lock className="size-4" />
                Change Password
              </Button>

              {/* Delete Account */}

              <AlertDialog>
                <AlertDialogTrigger
                  render={
                    <Button
                      type="button"
                      variant="destructive"
                      className="w-full cursor-pointer"
                    />
                  }
                >
                  <Trash2 className="size-4" />
                  Delete Account
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>

                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>
                      Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction
                      disabled={loading}
                      onClick={handleDeleteAccount}
                    >
                      {loading ? "Deleting..." : "Continue"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}
