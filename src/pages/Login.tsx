import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Activity, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Login = () => {
  const [tab, setTab] = useState<"patient" | "admin">("patient");
  const [emailPhone, setEmailPhone] = useState("");
  const [password, setPassword] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { login, registeredUsers } = useAuth();

  const validate = () => {
    const e: Record<string, string> = {};

    if (!emailPhone.trim()) e.emailPhone = "Email or Phone is required";
    else if (!emailPhone.includes("@") && !/^\d{10,}$/.test(emailPhone))
      e.emailPhone = "Enter a valid email or phone number";

    if (tab === "patient") {
      if (!password) e.password = "Password is required";
      else if (password.length < 6)
        e.password = "Password must be at least 6 characters";
    } else {
      if (!licenseNumber.trim())
        e.licenseNumber = "License number is required";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (tab === "patient") {
      const foundUser = registeredUsers.find(
        (u) =>
          u.type === "patient" &&
          (u.email === emailPhone || u.phone === emailPhone)
      );

      if (!foundUser) {
        toast.error(
          "No account found with this email/phone. Please register first."
        );
        setErrors((prev) => ({
          ...prev,
          emailPhone: "No account found with this email/phone",
        }));
        return;
      }

      if (foundUser.password !== password) {
        toast.error("Incorrect password. Please try again.");
        setErrors((prev) => ({
          ...prev,
          password: "Incorrect password",
        }));
        return;
      }

      login({
        name: foundUser.name,
        type: "patient",
        email: emailPhone,
      });

      toast.success("Login successful!");
      navigate("/patient-details");
    } else {
      const foundAdmin = registeredUsers.find(
        (u) =>
          u.type === "admin" &&
          (u.email === emailPhone || u.phone === emailPhone)
      );

      if (!foundAdmin) {
        toast.error(
          "No admin account found with this email/phone. Please register first."
        );
        setErrors((prev) => ({
          ...prev,
          emailPhone: "No admin found with this email/phone",
        }));
        return;
      }

      const foundByLicense = registeredUsers.find(
        (u) =>
          u.type === "admin" &&
          u.licenseNumber === licenseNumber &&
          (u.email === emailPhone || u.phone === emailPhone)
      );

      if (!foundByLicense) {
        toast.error(
          "No admin account found with this license number."
        );
        setErrors((prev) => ({
          ...prev,
          licenseNumber:
            "No admin found with this license number",
        }));
        return;
      }

      login({
        name: foundByLicense.name,
        type: "admin",
        licenseNumber,
        email: foundByLicense.email,
      });

      toast.success("Admin login successful!");
      navigate("/patient-details");
    }
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
          onClick={() => navigate("/")}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="flex items-center gap-2 mb-6">
          <Activity className="w-6 h-6 text-primary" />
          <span className="font-heading text-lg font-bold text-foreground">
            Login
          </span>
        </div>

        {/* Tabs */}
        <div className="flex bg-muted rounded-xl p-1 mb-8">
          {(["patient", "admin"] as const).map((t) => (
            <button
              key={t}
              onClick={() => {
                setTab(t);
                setErrors({});
              }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 capitalize ${
                tab === t
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.form
            key={tab}
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: tab === "patient" ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: tab === "patient" ? 20 : -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-5"
          >
            <div>
              <Label className="text-foreground">
                Phone / Email ID
              </Label>
              <Input
                value={emailPhone}
                onChange={(e) =>
                  setEmailPhone(e.target.value)
                }
                placeholder="Enter phone or email"
                className={`mt-1.5 ${
                  errors.emailPhone
                    ? "border-destructive"
                    : ""
                }`}
              />
              {errors.emailPhone && (
                <p className="text-destructive text-xs mt-1">
                  {errors.emailPhone}
                </p>
              )}
            </div>

            {tab === "patient" ? (
              <div>
                <Label className="text-foreground">
                  Password
                </Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Enter password"
                  className={`mt-1.5 ${
                    errors.password
                      ? "border-destructive"
                      : ""
                  }`}
                />
                {errors.password && (
                  <p className="text-destructive text-xs mt-1">
                    {errors.password}
                  </p>
                )}
              </div>
            ) : (
              <div>
                <Label className="text-foreground">
                  License Number
                </Label>
                <Input
                  value={licenseNumber}
                  onChange={(e) =>
                    setLicenseNumber(e.target.value)
                  }
                  placeholder="Enter license number"
                  className={`mt-1.5 ${
                    errors.licenseNumber
                      ? "border-destructive"
                      : ""
                  }`}
                />
                {errors.licenseNumber && (
                  <p className="text-destructive text-xs mt-1">
                    {errors.licenseNumber}
                  </p>
                )}
              </div>
            )}

            <Button
              type="submit"
              className="w-full glow-btn gradient-primary text-primary-foreground py-5 text-base"
            >
              Login as {tab === "patient" ? "Patient" : "Admin"}
            </Button>
          </motion.form>
        </AnimatePresence>

        <div className="text-center mt-6 space-y-2">
          <button
            onClick={() => navigate("/forgot-password")}
            className="text-sm text-primary font-semibold hover:underline"
          >
            Forgot Password?
          </button>

          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-primary font-semibold hover:underline"
            >
              Register
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;