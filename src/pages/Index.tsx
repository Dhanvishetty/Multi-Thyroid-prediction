import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Activity, Heart, Shield, TrendingUp, Users, Phone, Mail, MapPin, Stethoscope, Brain, Pill, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" as const },
  }),
};

const dashboardItems = [
  {
    icon: Stethoscope,
    title: "TSH Testing",
    desc: "Monitor Thyroid Stimulating Hormone levels to detect imbalances early.",
    color: "primary",
    details: "TSH (Thyroid Stimulating Hormone) is produced by the pituitary gland and regulates thyroid function. Normal range is 0.4–4.0 mIU/L. Elevated TSH suggests hypothyroidism, while low TSH may indicate hyperthyroidism. Regular TSH testing helps in early detection and effective management of thyroid disorders.",
  },
  {
    icon: Brain,
    title: "AI Prediction",
    desc: "Machine learning models analyze your reports for instant thyroid assessment.",
    color: "secondary",
    details: "Our AI prediction engine uses advanced machine learning algorithms trained on thousands of thyroid cases. By analyzing your TSH, T3, T4, TT4, and FTI levels along with clinical indicators, it provides an instant assessment of your thyroid health — classifying it as Normal, Hypothyroid, or Hyperthyroid with high accuracy.",
  },
  {
    icon: Shield,
    title: "Secure Records",
    desc: "Your medical data is encrypted and stored with HIPAA compliance.",
    color: "medical-teal",
    details: "We prioritize your data privacy. All medical records are encrypted using AES-256 encryption both in transit and at rest. Our systems are fully HIPAA-compliant, ensuring your personal health information is protected. Only you and your authorized healthcare providers can access your data.",
  },
  {
    icon: TrendingUp,
    title: "Health Trends",
    desc: "Track your hormone levels over time with interactive visual charts.",
    color: "medical-rose",
    details: "Our Health Trends feature allows you to visualize your thyroid hormone levels over weeks, months, or years. Interactive charts show TSH, T3, and T4 trends, helping you and your doctor identify patterns, monitor treatment effectiveness, and make informed decisions about your thyroid health journey.",
  },
];

const thyroidInfo = [
  {
    title: "Hypothyroidism",
    desc: "An underactive thyroid produces too little thyroid hormone. Common symptoms include fatigue, weight gain, cold sensitivity, and depression. Treated with daily hormone replacement therapy.",
    color: "medical-rose",
    levels: "TSH: High | T3/T4: Low",
    details: "Hypothyroidism occurs when the thyroid gland doesn't produce enough thyroid hormones. It's more common in women and people over 60. Key symptoms include persistent fatigue, unexplained weight gain, cold intolerance, dry skin, hair loss, constipation, and depression. Hashimoto's thyroiditis (an autoimmune condition) is the most common cause. Diagnosis involves blood tests for TSH and T4 levels. Treatment typically involves daily levothyroxine (synthetic T4) to normalize hormone levels. Regular monitoring is essential to adjust dosage.",
  },
  {
    title: "Normal Thyroid",
    desc: "A healthy thyroid maintains balanced hormone production, supporting metabolism, energy levels, heart rate, and body temperature regulation for optimal health.",
    color: "secondary",
    levels: "TSH: 0.4-4.0 mIU/L | T4: 5-12 µg/dL",
    details: "A normally functioning thyroid gland produces the right amount of T3 and T4 hormones to regulate your body's metabolism, energy production, heart rate, and temperature. Normal TSH range is 0.4–4.0 mIU/L, T4 is 5–12 µg/dL, and T3 is 80–200 ng/dL. Maintaining a healthy thyroid involves adequate iodine intake, regular exercise, stress management, and periodic health checkups. If you have a family history of thyroid disorders, regular screening is recommended.",
  },
  {
    title: "Hyperthyroidism",
    desc: "An overactive thyroid produces excess hormones. Symptoms include rapid heartbeat, weight loss, anxiety, and tremors. Treatment includes medication, radioactive iodine, or surgery.",
    color: "primary",
    levels: "TSH: Low | T3/T4: High",
    details: "Hyperthyroidism results from excessive thyroid hormone production. Graves' disease (an autoimmune disorder) is the most common cause. Symptoms include rapid or irregular heartbeat, unintended weight loss, increased appetite, nervousness, anxiety, tremors, sweating, and heat sensitivity. Diagnosis involves TSH, T3, and T4 blood tests, along with a radioactive iodine uptake test. Treatment options include antithyroid medications (methimazole), radioactive iodine therapy, or thyroid surgery. Left untreated, it can lead to serious heart problems and bone loss.",
  },
];

const Index = () => {
  const navigate = useNavigate();
  const { registeredUsers, predictionHistory } = useAuth();
  const [selectedDashboard, setSelectedDashboard] = useState<typeof dashboardItems[0] | null>(null);
  const [selectedThyroid, setSelectedThyroid] = useState<typeof thyroidInfo[0] | null>(null);

  const patientCount = registeredUsers.filter((u) => u.type === "patient").length;
  const avgAccuracy = predictionHistory.length > 0
    ? (predictionHistory.reduce((sum, p) => sum + p.accuracy, 0) / predictionHistory.length * 100).toFixed(1)
    : "95.0";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border/50">
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          <div className="flex items-center gap-2">
            <Activity className="w-7 h-7 text-primary" />
            <span className="font-heading text-xl font-bold text-foreground">ThyroCare<span className="text-primary"></span></span>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="glow-btn" onClick={() => navigate("/login")}>Login</Button>
            <Button className="glow-btn gradient-primary text-primary-foreground" onClick={() => navigate("/register")}>Register</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-28 pb-20 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-primary/5"
              style={{ width: 200 + i * 80, height: 200 + i * 80, top: `${10 + i * 15}%`, left: `${60 + i * 5}%` }}
              animate={{ y: [0, -20, 0], scale: [1, 1.05, 1] }}
              transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>

        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
              <motion.h1
                className="text-5xl md:text-6xl font-heading font-extrabold text-foreground mb-6 leading-tight"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                Thyroid <span className="text-primary">Diagnosis</span>
              </motion.h1>
              <motion.p className="text-lg text-muted-foreground mb-4 leading-relaxed" variants={fadeUp} custom={1}>
                Easily check your thyroid health with our smart prediction system. By analyzing basic health details and test values like T3, T4, and TSH, the system quickly identifies whether your thyroid function is <span className="font-semibold text-secondary">normal</span>, <span className="font-semibold text-medical-rose">underactive (hypothyroid)</span>, or <span className="font-semibold text-medical-teal">overactive (hyperthyroid)</span>.
              </motion.p>
              <motion.p className="text-muted-foreground leading-relaxed mb-8" variants={fadeUp} custom={2}>
                This tool is designed to provide quick insights, support early detection, and help you take timely action for better health.
              </motion.p>
              <motion.div variants={fadeUp} custom={3}>
                <Button size="lg" className="glow-btn gradient-primary text-primary-foreground text-lg px-8 py-6" onClick={() => navigate("/register")}>
                  Get Started
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              className="glass-card p-8 float-animation"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
            >
              <h2 className="text-2xl font-heading font-bold text-foreground mb-6 flex items-center gap-2">
                <Heart className="text-medical-rose w-6 h-6" /> Contact Us
              </h2>
              <div className="space-y-5">
                <div className="flex items-start gap-4 group cursor-glow">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Phone</p>
                    <p className="text-muted-foreground">+91 9876543210</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 cursor-glow">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Email</p>
                    <p className="text-muted-foreground">support@thyrocare.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 cursor-glow">
                  <div className="w-10 h-10 rounded-xl bg-medical-teal/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-medical-teal" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Address</p>
                    <p className="text-muted-foreground">New Medical Center ,Udupi,Karnataka,576213</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Dashboard Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <motion.h2
            className="text-3xl font-heading font-bold text-center text-foreground mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Health Dashboard
          </motion.h2>
          <motion.p
            className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Track thyroid health metrics and access comprehensive diagnostic tools. <span className="text-primary font-medium">Click any card to learn more.</span>
          </motion.p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dashboardItems.map((item, i) => (
              <motion.div
                key={item.title}
                className="glass-card p-6 cursor-pointer group hover:border-primary/30 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                onClick={() => setSelectedDashboard(item)}
              >
                <div className={`w-12 h-12 rounded-xl bg-${item.color}/10 flex items-center justify-center mb-4`}>
                  <item.icon className={`w-6 h-6 text-${item.color}`} />
                </div>
                <h3 className="font-heading font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
                <p className="text-xs text-primary mt-3 opacity-0 group-hover:opacity-100 transition-opacity">Click for details →</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Users, stat: patientCount.toString(), label: "Patients Registered" },
              { icon: FileText, stat: `${avgAccuracy}%`, label: "Prediction Accuracy" },
              { icon: Pill, stat: predictionHistory.length.toString(), label: "Predictions Made" },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                className="text-center p-8"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <item.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <p className="text-4xl font-heading font-extrabold text-foreground">{item.stat}</p>
                <p className="text-muted-foreground mt-1">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Medical Info Section */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-6">
          <motion.h2
            className="text-3xl font-heading font-bold text-center text-foreground mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Understanding Thyroid Disorders
          </motion.h2>
          <motion.p
            className="text-center text-muted-foreground mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-primary font-medium">Click any card to read more.</span>
          </motion.p>

          <div className="grid md:grid-cols-3 gap-8">
            {thyroidInfo.map((item, i) => (
              <motion.div
                key={item.title}
                className="glass-card p-8 cursor-pointer hover:border-primary/20 transition-all duration-300 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -3 }}
                onClick={() => setSelectedThyroid(item)}
              >
                <div className={`w-3 h-3 rounded-full bg-${item.color} mb-4`} />
                <h3 className="text-xl font-heading font-bold text-foreground mb-3">{item.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{item.desc}</p>
                <div className="text-xs font-mono bg-muted/50 rounded-lg p-3 text-muted-foreground">
                  {item.levels}
                </div>
                <p className="text-xs text-primary mt-3 opacity-0 group-hover:opacity-100 transition-opacity">Click for details →</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border bg-card/50">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm text-muted-foreground">© 2026 ThyroCare. All rights reserved. For informational purposes only — consult a physician for medical advice.</p>
        </div>
      </footer>

      {/* Dashboard Info Dialog */}
      <Dialog open={!!selectedDashboard} onOpenChange={(open) => !open && setSelectedDashboard(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl font-heading">
              {selectedDashboard && (
                <>
                  <div className={`w-10 h-10 rounded-xl bg-${selectedDashboard.color}/10 flex items-center justify-center`}>
                    <selectedDashboard.icon className={`w-5 h-5 text-${selectedDashboard.color}`} />
                  </div>
                  {selectedDashboard.title}
                </>
              )}
            </DialogTitle>
            <DialogDescription className="text-base leading-relaxed pt-4">
              {selectedDashboard?.details}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Thyroid Info Dialog */}
      <Dialog open={!!selectedThyroid} onOpenChange={(open) => !open && setSelectedThyroid(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl font-heading">
              {selectedThyroid && (
                <>
                  <div className={`w-3 h-3 rounded-full bg-${selectedThyroid.color}`} />
                  {selectedThyroid.title}
                </>
              )}
            </DialogTitle>
            <DialogDescription className="space-y-4 pt-4">
              <p className="text-base leading-relaxed">{selectedThyroid?.details}</p>
              {selectedThyroid && (
                <div className="text-xs font-mono bg-muted/50 rounded-lg p-3 text-muted-foreground">
                  {selectedThyroid.levels}
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
