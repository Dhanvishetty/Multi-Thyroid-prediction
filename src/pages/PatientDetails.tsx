import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Activity, ArrowLeft, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { predictThyroid, PatientData } from "@/lib/thyroidPrediction";

const PatientDetails = () => {
  const { user, logout, addPrediction } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    age: "", sex: "", tsh: "", t3: "", t4: "", tt4: "", fti: "",
    goiter: false, tumor: false, lithium: false, weightChange: false, fatigue: false,
  });

  const update = (key: string, val: string | boolean) => setForm((p) => ({ ...p, [key]: val }));

  const handlePredict = () => {
    if (!form.age || !form.sex || !form.tsh || !form.t3 || !form.t4 || !form.tt4 || !form.fti) {
      toast.error("Please fill in all required fields");
      return;
    }
    toast.success("Prediction started! Analyzing your thyroid data...");

    const patientData: PatientData = {
      age: Number(form.age),
      sex: form.sex,
      tsh: Number(form.tsh),
      t3: Number(form.t3),
      t4: Number(form.t4),
      tt4: Number(form.tt4),
      fti: Number(form.fti),
      goiter: form.goiter,
      tumor: form.tumor,
      lithium: form.lithium,
      weightChange: form.weightChange,
      fatigue: form.fatigue,
    };

    const result = predictThyroid(patientData);
    addPrediction({
      id: Date.now().toString(),
      date: new Date().toLocaleString(),
      prediction: result.finalPrediction,
      bestModel: result.bestModel,
      accuracy: result.models.find((m) => m.name === result.bestModel)!.testAccuracy,
      tsh: patientData.tsh,
      t3: patientData.t3,
      t4: patientData.t4,
    });
    navigate("/prediction-results", { state: { result } });
  };

  return (
    <div className="min-h-screen bg-background gradient-hero">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-lg border-b border-border/50">
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          <div className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary" />
            <span className="font-heading text-lg font-bold text-foreground">ThyroCare<span className="text-primary"></span></span>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate("/prediction-history")}>History</Button>
          <Button variant="outline" size="sm" onClick={() => { logout(); navigate("/"); }}>Logout</Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-10 max-w-3xl">
        <motion.div
          className="glass-card p-8 md:p-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <Stethoscope className="w-8 h-8 text-primary" />
            <motion.h1
              className="text-3xl font-heading font-extrabold text-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Patient Details
            </motion.h1>
          </div>

          <motion.p
            className="text-primary font-medium mb-1"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            Patient Name: <span className="text-foreground font-bold">{user?.name || "Guest"}</span>
          </motion.p>

          <motion.p
            className="text-muted-foreground mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Please enter the following medical information based on the reports
          </motion.p>

          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <Label className="text-foreground">Age</Label>
                <Input type="number" value={form.age} onChange={(e) => update("age", e.target.value)} placeholder="Enter age" className="mt-1.5" />
              </div>
              <div>
                <Label className="text-foreground">Sex</Label>
                <Select value={form.sex} onValueChange={(v) => update("sex", v)}>
                  <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select sex" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Hormone Levels */}
            <div>
              <h3 className="font-heading font-semibold text-foreground mb-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" /> Hormone Levels
              </h3>
              <div className="grid md:grid-cols-2 gap-5">
                {[
                  { key: "tsh", label: "TSH Level (mIU/L)" },
                  { key: "t3", label: "T3 Level (ng/dL)" },
                  { key: "t4", label: "T4 Level (µg/dL)" },
                  { key: "tt4", label: "TT4 Level (µg/dL)" },
                  { key: "fti", label: "FTI Level" },
                ].map((f) => (
                  <div key={f.key}>
                    <Label className="text-foreground">{f.label}</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={(form as any)[f.key]}
                      onChange={(e) => update(f.key, e.target.value)}
                      placeholder={`Enter ${f.label.split(" ")[0]}`}
                      className="mt-1.5"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Toggle Fields */}
            <div>
              <h3 className="font-heading font-semibold text-foreground mb-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-secondary" /> Clinical Indicators
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { key: "goiter", label: "Goiter" },
                  { key: "tumor", label: "Tumor" },
                  { key: "lithium", label: "Lithium" },
                  { key: "weightChange", label: "Weight Change" },
                  { key: "fatigue", label: "Fatigue" },
                ].map((f) => (
                  <div key={f.key} className="flex items-center justify-between bg-muted/50 rounded-xl p-3">
                    <Label className="text-foreground text-sm">{f.label}</Label>
                    <Switch
                      checked={(form as any)[f.key]}
                      onCheckedChange={(v) => update(f.key, v)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <Button
              onClick={handlePredict}
              size="lg"
              className="w-full glow-btn gradient-primary text-primary-foreground py-6 text-lg font-bold mt-4"
            >
              🔬 Start Prediction
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default PatientDetails;
