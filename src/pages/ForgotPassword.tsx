import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Activity, ArrowLeft, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [step, setStep] = useState<"identify" | "reset">("identify");
  const [emailPhone, setEmailPhone] = useState("");
  const [name, setName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { registeredUsers, resetPassword } = useAuth();

  const handleIdentify = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!emailPhone.trim()) errs.emailPhone = "Email or Phone is required";
    if (!name.trim()) errs.name = "Name is required";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const found = registeredUsers.find(
      (u) =>
        u.type === "patient" &&
        (u.email === emailPhone || u.phone === emailPhone) &&
        u.name === name
    );
    if (!found) {
      toast.error("No matching account found. Please check your details.");
      setErrors({ emailPhone: "No matching account found" });
      return;
    }
    setStep("reset");
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!newPassword) errs.newPassword = "New password is required";
    else if (newPassword.length < 6) errs.newPassword = "Password must be at least 6 characters";
    if (newPassword !== confirmPassword) errs.confirmPassword = "Passwords do not match";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    resetPassword(emailPhone, newPassword);
    toast.success("Password reset successfully! Please login with your new password.");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background gradient-hero flex items-center justify-center p-6">
      <motion.div
        className="glass-card w-full max-w-md p-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </button>

        <div className="flex items-center gap-2 mb-6">
          <KeyRound className="w-6 h-6 text-primary" />
          <span className="font-heading text-lg font-bold text-foreground">
            {step === "identify" ? "Forgot Password" : "Reset Password"}
          </span>
        </div>

        {step === "identify" ? (
          <motion.form
            onSubmit={handleIdentify}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-5"
          >
            <p className="text-sm text-muted-foreground mb-4">
              Enter your registered name and email/phone to verify your identity.
            </p>
            <div>
              <Label className="text-foreground">Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your registered name"
                className={`mt-1.5 ${errors.name ? "border-destructive" : ""}`}
              />
              {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <Label className="text-foreground">Phone / Email ID</Label>
              <Input
                value={emailPhone}
                onChange={(e) => setEmailPhone(e.target.value)}
                placeholder="Enter registered phone or email"
                className={`mt-1.5 ${errors.emailPhone ? "border-destructive" : ""}`}
              />
              {errors.emailPhone && <p className="text-destructive text-xs mt-1">{errors.emailPhone}</p>}
            </div>
            <Button type="submit" className="w-full glow-btn gradient-primary text-primary-foreground py-5 text-base">
              Verify Identity
            </Button>
          </motion.form>
        ) : (
          <motion.form
            onSubmit={handleReset}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-5"
          >
            <p className="text-sm text-muted-foreground mb-4">
              Set your new password below.
            </p>
            <div>
              <Label className="text-foreground">New Password</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className={`mt-1.5 ${errors.newPassword ? "border-destructive" : ""}`}
              />
              {errors.newPassword && <p className="text-destructive text-xs mt-1">{errors.newPassword}</p>}
            </div>
            <div>
              <Label className="text-foreground">Confirm Password</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className={`mt-1.5 ${errors.confirmPassword ? "border-destructive" : ""}`}
              />
              {errors.confirmPassword && <p className="text-destructive text-xs mt-1">{errors.confirmPassword}</p>}
            </div>
            <Button type="submit" className="w-full glow-btn gradient-primary text-primary-foreground py-5 text-base">
              Reset Password
            </Button>
          </motion.form>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
