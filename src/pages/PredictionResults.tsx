import React from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Activity, ArrowLeft, CheckCircle, AlertTriangle, XCircle, BarChart3, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { PredictionResult, ThyroidClass } from "@/lib/thyroidPrediction";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

const diagnosisConfig: Record<ThyroidClass, { icon: React.ReactNode; color: string; bg: string; description: string }> = {
  Normal: {
    icon: <CheckCircle className="w-10 h-10 text-green-500" />,
    color: "text-green-500",
    bg: "bg-green-500/10 border-green-500/30",
    description: "Your thyroid hormone levels are within the healthy range.No thyroid disorder is detected at this time.Maintain a healthy lifestyle and consult a doctor if you experience any unusual symptoms.",
  },
  Hypothyroid: {
    icon: <AlertTriangle className="w-10 h-10 text-yellow-500" />,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10 border-yellow-500/30",
    description: "Your thyroid gland is producing less hormone than normal, which can slow down body functions.You may experience symptoms such as fatigue, weight gain, dry skin, feeling cold, or low energy.Please consult a doctor for confirmation and proper treatment.",
  },
  Hyperthyroid: {
    icon: <XCircle className="w-10 h-10 text-red-500" />,
    color: "text-red-500",
    bg: "bg-red-500/10 border-red-500/30",
    description: "Your thyroid gland is producing more hormone than normal, which can speed up body functions.You may experience symptoms such as weight loss, rapid heartbeat, anxiety, sweating, or difficulty sleeping.Please consult a doctor for confirmation and appropriate treatment.",
  },
};

const PredictionResults = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const result = location.state?.result as PredictionResult | undefined;

  if (!result) {
    navigate("/patient-details");
    return null;
  }

  const diagnosis = diagnosisConfig[result.finalPrediction];

  const comparisonData = result.models.map((m) => ({
    name: m.name,
    "Train Accuracy": +(m.trainAccuracy * 100).toFixed(1),
    "Test Accuracy": +(m.testAccuracy * 100).toFixed(1),
    "CV Score": +(m.cvScore * 100).toFixed(1),
  }));

  const radarData = ["Hypothyroid", "Hyperthyroid", "Normal"].map((cls) => {
    const best = result.models.find((m) => m.name === result.bestModel)!;
    return {
      metric: cls,
      Precision: +(best.precision[cls as ThyroidClass] * 100).toFixed(1),
      Recall: +(best.recall[cls as ThyroidClass] * 100).toFixed(1),
      F1: +(best.f1[cls as ThyroidClass] * 100).toFixed(1),
      Specificity: +(best.specificity[cls as ThyroidClass] * 100).toFixed(1),
    };
  });

  const featureData = result.featureImportance.map((f) => ({
    name: f.feature,
    importance: +(f.importance * 100).toFixed(1),
  }));

  return (
    <div className="min-h-screen bg-background gradient-hero">
      <header className="bg-card/80 backdrop-blur-lg border-b border-border/50">
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          <div className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary" />
            <span className="font-heading text-lg font-bold text-foreground">ThyroCare<span className="text-primary"></span></span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate("/patient-details")}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            <Button variant="outline" size="sm" onClick={() => { logout(); navigate("/"); }}>Logout</Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-10 max-w-5xl space-y-8">
        {/* Diagnosis Card */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
          <Card className={`border-2 ${diagnosis.bg}`}>
            <CardContent className="flex flex-col md:flex-row items-center gap-6 p-8">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: "spring" }}>
                {diagnosis.icon}
              </motion.div>
              <div className="text-center md:text-left">
                <h1 className={`text-3xl font-heading font-extrabold ${diagnosis.color}`}>
                  {result.finalPrediction}
                </h1>
                <p className="text-muted-foreground mt-2">{diagnosis.description}</p>
                <div className="flex items-center gap-2 mt-3">
                  <Trophy className="w-4 h-4 text-primary" />
                  <span className="text-sm text-foreground">
                    Best Model: <strong>{result.bestModel}</strong> — Accuracy: <strong>{(result.models.find((m) => m.name === result.bestModel)!.testAccuracy * 100).toFixed(1)}%</strong>
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Model Comparison Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <BarChart3 className="w-5 h-5 text-primary" /> Model Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis domain={[70, 100]} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  <Legend />
                  <Bar dataKey="Train Accuracy" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Test Accuracy" fill="#00B894" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="CV Score" fill="#F1C40F" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Per-Model Results Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Detailed Model Results</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-foreground">Model</th>
                    <th className="text-center py-3 px-2 text-foreground">Prediction</th>
                    <th className="text-center py-3 px-2 text-foreground">Confidence</th>
                    <th className="text-center py-3 px-2 text-foreground">Train Acc</th>
                    <th className="text-center py-3 px-2 text-foreground">Test Acc</th>
                    <th className="text-center py-3 px-2 text-foreground">CV Score</th>
                  </tr>
                </thead>
                <tbody>
                  {result.models.map((m) => (
                    <tr key={m.name} className={`border-b border-border/50 ${m.name === result.bestModel ? "bg-primary/5" : ""}`}>
                      <td className="py-3 px-2 font-medium text-foreground">
                        {m.name} {m.name === result.bestModel && <span className="text-primary text-xs ml-1">★ Best</span>}
                      </td>
                      <td className={`py-3 px-2 text-center font-bold ${diagnosisConfig[m.prediction].color}`}>{m.prediction}</td>
                      <td className="py-3 px-2 text-center text-muted-foreground">{(m.confidence * 100).toFixed(1)}%</td>
                      <td className="py-3 px-2 text-center text-muted-foreground">{(m.trainAccuracy * 100).toFixed(1)}%</td>
                      <td className="py-3 px-2 text-center text-muted-foreground">{(m.testAccuracy * 100).toFixed(1)}%</td>
                      <td className="py-3 px-2 text-center text-muted-foreground">{(m.cvScore * 100).toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Per-Class Metrics Radar */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground text-sm">Per-Class Metrics ({result.bestModel})</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis dataKey="metric" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 12 }} />
                    <PolarRadiusAxis domain={[70, 100]} stroke="hsl(var(--border))" />
                    <Radar name="Precision" dataKey="Precision" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} />
                    <Radar name="Recall" dataKey="Recall" stroke="#00B894" fill="#00B894" fillOpacity={0.15} />
                    <Radar name="F1" dataKey="F1" stroke="#F1C40F" fill="#F1C40F" fillOpacity={0.1} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Feature Importance */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground text-sm">Feature Importance (Random Forest)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={featureData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" domain={[0, 30]} stroke="hsl(var(--muted-foreground))" />
                    <YAxis type="category" dataKey="name" width={90} stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                    <Bar dataKey="importance" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Disclaimer */}
        <motion.p
          className="text-center text-xs text-muted-foreground pb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          ⚠️ This is a screening tool and does not replace professional medical diagnosis. Please consult an endocrinologist for confirmation.
        </motion.p>
      </div>
    </div>
  );
};

export default PredictionResults;
