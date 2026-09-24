import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Activity, ArrowLeft, CheckCircle, AlertTriangle, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

const iconMap: Record<string, React.ReactNode> = {
  Normal: <CheckCircle className="w-5 h-5 text-green-500" />,
  Hypothyroid: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
  Hyperthyroid: <XCircle className="w-5 h-5 text-red-500" />,
};

const PredictionHistory = () => {
  const { predictionHistory, logout } = useAuth();
  const navigate = useNavigate();

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

      <div className="container mx-auto px-6 py-10 max-w-3xl">
        <motion.h1
          className="text-3xl font-heading font-extrabold text-foreground mb-8 flex items-center gap-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Clock className="w-8 h-8 text-primary" /> Prediction History
        </motion.h1>

        {predictionHistory.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              No predictions yet. Go to Patient Details to run your first prediction.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {predictionHistory.map((entry, i) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="hover:border-primary/30 transition-colors">
                  <CardContent className="flex items-center gap-4 p-5">
                    {iconMap[entry.prediction]}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-heading font-bold text-foreground">{entry.prediction}</span>
                        <span className="text-xs text-muted-foreground">via {entry.bestModel}</span>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                          {(entry.accuracy * 100).toFixed(1)}% acc
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        TSH: {entry.tsh} | T3: {entry.t3} | T4: {entry.t4}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{entry.date}</span>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionHistory;
