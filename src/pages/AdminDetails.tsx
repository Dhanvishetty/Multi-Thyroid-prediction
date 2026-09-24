import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Activity, Shield, Award, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const AdminDetails = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background gradient-hero">
      <header className="bg-card/80 backdrop-blur-lg border-b border-border/50">
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          <div className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary" />
            <span className="font-heading text-lg font-bold text-foreground">ThyroCare<span className="text-primary"></span></span>
          </div>
          <Button variant="outline" size="sm" onClick={() => { logout(); navigate("/"); }}>Logout</Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-16 max-w-2xl">
        <motion.div
          className="glass-card p-10 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Shield className="w-10 h-10 text-primary" />
          </motion.div>

          <motion.h1
            className="text-3xl font-heading font-extrabold text-foreground mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Admin Details
          </motion.h1>

          <motion.div
            className="space-y-6 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="glass-card p-6 text-left">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-5 h-5 text-primary" />
                <span className="font-heading font-semibold text-foreground">Admin Profile</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="text-muted-foreground">Name</span>
                  <span className="font-semibold text-foreground">{user?.name || "Admin"}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="text-muted-foreground">Email / Phone</span>
                  <span className="font-semibold text-foreground">{user?.email || "N/A"}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="text-muted-foreground">License Number</span>
                  <span className="font-semibold text-foreground">{user?.licenseNumber || "N/A"}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">Status</span>
                  <span className="flex items-center gap-1 text-secondary font-semibold">
                    <CheckCircle2 className="w-4 h-4" /> Verified
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDetails;
