import { useEffect, useState } from "react";

import { motion, AnimatePresence } from "framer-motion";

import { Spinner } from "@/components/ui/spinner";

import {
  AlertCircleIcon,
  Camera,
  Check,
  Edit3,
  Eye,
  EyeOff,
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

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Alert, AlertTitle } from "@/components/ui/alert";

import useAuth from "@/services/Store";

import {
  changePassword,
  deleteUser,
  updateProfile,
  uploadProfileImage,
} from "@/services/AuthService";

import toast from "react-hot-toast";

import { useNavigate } from "react-router";

export default function UserProfile() {
  const user = useAuth((state) => state.user);
  const logout = useAuth((state) => state.logout);
  const updateUser = useAuth((state) => state.updateUser);

  const navigate = useNavigate();

  // ============================================================
  // PROFILE STATE
  // ============================================================

  const [isEditing, setIsEditing] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<any>(null);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    image: "",
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // ============================================================
  // CHANGE PASSWORD STATE
  // ============================================================

  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordLoading, setPasswordLoading] = useState(false);

  const [passwordError, setPasswordError] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  const [showNewPassword, setShowNewPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ============================================================
  // SYNC PROFILE WITH ZUSTAND USER
  // ============================================================

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name ?? "",
        email: user.email,
        image: user.image ?? "",
      });
    }
  }, [user]);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // ============================================================
  // PROFILE HANDLERS
  // ============================================================

  const handleChange = (field: keyof typeof profile, value: string) => {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));
  };

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

  const handleCancelEditing = () => {
    if (user) {
      setProfile({
        name: user.name ?? "",
        email: user.email,
        image: user.image ?? "",
      });
    }
    setSelectedImage(null);
    setImagePreview(null);
    setIsEditing(false);
    setError(null);
  };

  const handleSaveProfile = async () => {
    if (!profile.name.trim()) {
      toast.error("Name is required.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Update profile information
      const updatedUser = await updateProfile(profile.name.trim());

      updateUser(updatedUser);

      // Upload image if a new image was selected
      if (selectedImage) {
        const updatedUserWithImage = await uploadProfileImage(selectedImage);

        updateUser(updatedUserWithImage);

        setProfile((current) => ({
          ...current,
          image: updatedUserWithImage.image ?? "",
        }));
      }

      setSelectedImage(null);
      setImagePreview(null);

      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error: any) {
      setError(error);

      toast.error(
        error?.response?.data?.message || "Failed to update your profile.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // PROFILE IMAGE
  // ============================================================

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, PNG, and WebP images are allowed.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must not exceed 5 MB.");
      event.target.value = "";
      return;
    }

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // ============================================================
  // AVATAR INITIALS
  // ============================================================

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

  // ============================================================
  // CHANGE PASSWORD
  // ============================================================

  const resetPasswordForm = () => {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setPasswordError("");

    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const handlePasswordDialogChange = (open: boolean) => {
    setIsPasswordDialogOpen(open);

    if (!open) {
      resetPasswordForm();
    }
  };

  const handlePasswordInputChange = (
    field: keyof typeof passwordData,
    value: string,
  ) => {
    setPasswordData((current) => ({
      ...current,
      [field]: value,
    }));

    setPasswordError("");
  };

  const handleChangePassword = async () => {
    setPasswordError("");

    // ----------------------------------------------------------
    // Validation
    // ----------------------------------------------------------

    if (!passwordData.currentPassword) {
      setPasswordError("Current password is required.");
      return;
    }

    if (!passwordData.newPassword) {
      setPasswordError("New password is required.");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      setPasswordError(
        "New password must be different from your current password.",
      );
      return;
    }

    // ----------------------------------------------------------
    // API CALL
    // ----------------------------------------------------------

    try {
      setPasswordLoading(true);

      await changePassword(
        passwordData.currentPassword,
        passwordData.newPassword,
      );

      resetPasswordForm();

      setIsPasswordDialogOpen(false);

      toast.success("Password changed successfully. Please log in again.");

      /*
       * Backend revokes all refresh tokens after a password change.
       * Logging out here gives the user a clean authentication state.
       */

      await logout();

      navigate("/login");
    } catch (error: any) {
      setPasswordError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to change password.",
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  // ============================================================
  // DELETE ACCOUNT
  // ============================================================

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

  // ============================================================
  // PROVIDER CHECK
  // ============================================================

  const isLocalAccount = String(user?.provider ?? "").toUpperCase() === "LOCAL";

  // ============================================================
  // UI
  // ============================================================

  return (
    <main className="min-h-screen overflow-hidden bg-background px-4 py-10 text-foreground">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        {/* ======================================================
            PAGE HEADER
        ====================================================== */}

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

        {/* ======================================================
            ERROR
        ====================================================== */}

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
                  {error?.response?.data?.message ||
                    error?.message ||
                    "Something went wrong while updating your profile."}
                </AlertTitle>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ======================================================
            PROFILE CARD
        ====================================================== */}

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
              {/* =================================================
                  AVATAR
              ================================================= */}

              <motion.div layout className="flex flex-col items-center gap-3">
                <div className="relative">
                  <Avatar
                    className={`size-28 border border-border shadow-lg ${
                      loading ? "opacity-60" : ""
                    }`}
                  >
                    {loading && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-full bg-background/50 backdrop-blur-sm">
                        <Spinner className="size-6" />
                      </div>
                    )}
                    <AvatarImage
                      src={imagePreview || profile.image || undefined}
                      alt={profile.name || "User"}
                    />

                    <AvatarFallback className="bg-primary/10 text-2xl text-primary">
                      {getInitials(profile.name)}
                    </AvatarFallback>
                  </Avatar>

                  {isEditing && (
                    <>
                      <label
                        htmlFor="profile-picture"
                        className="absolute bottom-0 right-0 flex size-10 cursor-pointer items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground shadow-lg transition-all hover:scale-105 hover:bg-primary/90"
                        title="Change profile picture"
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
                  <p className="text-center text-xs text-muted-foreground">
                    Click the camera icon to change your picture.
                    <br />
                    JPG, PNG or WebP · Max 5 MB
                  </p>
                )}
              </motion.div>

              {/* =================================================
                  PROFILE FIELDS
              ================================================= */}

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
                      disabled
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
                          user?.enabled ? "bg-primary" : "bg-muted-foreground"
                        }`}
                      />

                      {user?.enabled ? "Active" : "Disabled"}
                    </span>
                  </div>
                </div>
              </div>

              {/* =================================================
                  EDIT ACTIONS
              ================================================= */}

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
                      disabled={loading}
                    >
                      <X className="size-4" />
                      Cancel
                    </Button>

                    <Button
                      type="button"
                      className="flex-1 cursor-pointer"
                      onClick={handleSaveProfile}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Check className="size-4" />
                          Save Profile
                        </>
                      )}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* ======================================================
            ACCOUNT SETTINGS
        ====================================================== */}

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
              {/* =================================================
                  CHANGE PASSWORD
              ================================================= */}

              {isLocalAccount && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full cursor-pointer justify-center"
                  onClick={() => {
                    setPasswordError("");
                    setIsPasswordDialogOpen(true);
                  }}
                >
                  <Lock className="size-4" />
                  Change Password
                </Button>
              )}

              {/* =================================================
                  SOCIAL ACCOUNT MESSAGE
              ================================================= */}

              {!isLocalAccount && (
                <div className="rounded-lg border border-border/60 bg-muted/20 px-4 py-3">
                  <div className="flex gap-3">
                    <ShieldCheck className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

                    <div>
                      <p className="text-sm font-medium">
                        Password managed by {user?.provider ?? "your provider"}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        This account uses social authentication, so there is no
                        AuthForge password to change.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* =================================================
                  DELETE ACCOUNT
              ================================================= */}

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

      {/* ========================================================
          CHANGE PASSWORD DIALOG
      ======================================================== */}

      <Dialog
        open={isPasswordDialogOpen}
        onOpenChange={handlePasswordDialogChange}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="size-5" />
              Change Password
            </DialogTitle>

            <DialogDescription>
              Enter your current password and choose a new password for your
              account.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2">
            {/* =================================================
                ERROR
            ================================================= */}

            <AnimatePresence>
              {passwordError && (
                <motion.div
                  initial={{
                    opacity: 0,
                    height: 0,
                  }}
                  animate={{
                    opacity: 1,
                    height: "auto",
                  }}
                  exit={{
                    opacity: 0,
                    height: 0,
                  }}
                >
                  <Alert variant="destructive">
                    <AlertCircleIcon />

                    <AlertTitle>{passwordError}</AlertTitle>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            {/* =================================================
                CURRENT PASSWORD
            ================================================= */}

            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="current-password"
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(event) =>
                    handlePasswordInputChange(
                      "currentPassword",
                      event.target.value,
                    )
                  }
                  placeholder="Enter current password"
                  className="pr-10 pl-10"
                  disabled={passwordLoading}
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  onClick={() => setShowCurrentPassword((current) => !current)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
                  tabIndex={-1}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            {/* =================================================
                NEW PASSWORD
            ================================================= */}

            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(event) =>
                    handlePasswordInputChange("newPassword", event.target.value)
                  }
                  placeholder="Enter new password"
                  className="pr-10 pl-10"
                  disabled={passwordLoading}
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  onClick={() => setShowNewPassword((current) => !current)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
                  tabIndex={-1}
                >
                  {showNewPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>

              <p className="text-xs text-muted-foreground">
                Password must be at least 8 characters.
              </p>
            </div>

            {/* =================================================
                CONFIRM PASSWORD
            ================================================= */}

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(event) =>
                    handlePasswordInputChange(
                      "confirmPassword",
                      event.target.value,
                    )
                  }
                  placeholder="Confirm new password"
                  className="pr-10 pl-10"
                  disabled={passwordLoading}
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((current) => !current)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* ====================================================
              DIALOG ACTIONS
          ==================================================== */}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              onClick={() => handlePasswordDialogChange(false)}
              disabled={passwordLoading}
            >
              Cancel
            </Button>

            <Button
              type="button"
              className="cursor-pointer"
              onClick={handleChangePassword}
              disabled={passwordLoading}
            >
              {passwordLoading ? (
                "Changing Password..."
              ) : (
                <>
                  <Check className="size-4" />
                  Change Password
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
