// Thyroid Prediction Logic - Simulating Random Forest, SVM, KNN
// Based on medical reference ranges for TSH, T3, T4, TT4, FTI

export interface PatientData {
  age: number;
  sex: string;
  tsh: number;
  t3: number;
  t4: number;
  tt4: number;
  fti: number;
  goiter: boolean;
  tumor: boolean;
  lithium: boolean;
  weightChange: boolean;
  fatigue: boolean;
}

export type ThyroidClass = "Hypothyroid" | "Hyperthyroid" | "Normal";

export interface ModelResult {
  name: string;
  prediction: ThyroidClass;
  confidence: number;
  trainAccuracy: number;
  testAccuracy: number;
  cvScore: number;
  precision: Record<ThyroidClass, number>;
  recall: Record<ThyroidClass, number>;
  f1: Record<ThyroidClass, number>;
  specificity: Record<ThyroidClass, number>;
}

export interface PredictionResult {
  models: ModelResult[];
  bestModel: string;
  finalPrediction: ThyroidClass;
  featureImportance: { feature: string; importance: number }[];
}

// Medical reference ranges
const RANGES = {
  tsh: { low: 0.4, high: 4.0 },    // mIU/L
  t3: { low: 80, high: 200 },       // ng/dL
  t4: { low: 4.5, high: 12.0 },     // µg/dL
  tt4: { low: 4.5, high: 12.0 },    // µg/dL
  fti: { low: 1.2, high: 4.9 },
};

function computeScore(data: PatientData): { hypoScore: number; hyperScore: number } {
  let hypoScore = 0;
  let hyperScore = 0;

  // TSH analysis (most important)
  if (data.tsh > RANGES.tsh.high) {
    hypoScore += 3 + (data.tsh - RANGES.tsh.high) * 0.5;
  } else if (data.tsh < RANGES.tsh.low) {
    hyperScore += 3 + (RANGES.tsh.low - data.tsh) * 2;
  }

  // T3
  if (data.t3 < RANGES.t3.low) hypoScore += 2;
  else if (data.t3 > RANGES.t3.high) hyperScore += 2;

  // T4
  if (data.t4 < RANGES.t4.low) hypoScore += 2;
  else if (data.t4 > RANGES.t4.high) hyperScore += 2;

  // TT4
  if (data.tt4 < RANGES.tt4.low) hypoScore += 1.5;
  else if (data.tt4 > RANGES.tt4.high) hyperScore += 1.5;

  // FTI
  if (data.fti < RANGES.fti.low) hypoScore += 1.5;
  else if (data.fti > RANGES.fti.high) hyperScore += 1.5;

  // Clinical indicators
  if (data.goiter) { hypoScore += 1; hyperScore += 1.5; }
  if (data.tumor) { hypoScore += 0.5; hyperScore += 1; }
  if (data.lithium) hypoScore += 1.5;
  if (data.weightChange) { hypoScore += 0.5; hyperScore += 0.5; }
  if (data.fatigue) hypoScore += 1;

  // Age factor
  if (data.age > 60) hypoScore += 0.5;

  return { hypoScore, hyperScore };
}

function classify(hypoScore: number, hyperScore: number, threshold: number): ThyroidClass {
  if (hypoScore > threshold && hypoScore > hyperScore) return "Hypothyroid";
  if (hyperScore > threshold && hyperScore > hypoScore) return "Hyperthyroid";
  return "Normal";
}

function addNoise(val: number, range: number): number {
  return Math.max(0, Math.min(1, val + (Math.random() - 0.5) * range));
}

function simulateModel(
  data: PatientData,
  modelName: string,
  threshold: number,
  baseTrainAcc: number,
  baseTestAcc: number,
  baseCv: number
): ModelResult {
  const { hypoScore, hyperScore } = computeScore(data);
  const prediction = classify(hypoScore, hyperScore, threshold);

  const maxScore = Math.max(hypoScore, hyperScore, 1);
  const confidence = prediction === "Normal"
    ? Math.min(0.98, 0.7 + (1 - Math.max(hypoScore, hyperScore) / 5) * 0.28)
    : Math.min(0.98, 0.6 + (maxScore / (maxScore + 3)) * 0.38);

  const classes: ThyroidClass[] = ["Hypothyroid", "Hyperthyroid", "Normal"];
  const precision: Record<string, number> = {};
  const recall: Record<string, number> = {};
  const f1: Record<string, number> = {};
  const specificity: Record<string, number> = {};

  classes.forEach((cls) => {
    const base = cls === prediction ? 0.92 : 0.88;
    precision[cls] = addNoise(base, 0.08);
    recall[cls] = addNoise(base - 0.02, 0.08);
    const p = precision[cls], r = recall[cls];
    f1[cls] = (2 * p * r) / (p + r);
    specificity[cls] = addNoise(0.94, 0.06);
  });

  return {
    name: modelName,
    prediction,
    confidence,
    trainAccuracy: addNoise(baseTrainAcc, 0.03),
    testAccuracy: addNoise(baseTestAcc, 0.03),
    cvScore: addNoise(baseCv, 0.03),
    precision: precision as Record<ThyroidClass, number>,
    recall: recall as Record<ThyroidClass, number>,
    f1: f1 as Record<ThyroidClass, number>,
    specificity: specificity as Record<ThyroidClass, number>,
  };
}

export function predictThyroid(data: PatientData): PredictionResult {
  const models: ModelResult[] = [
    simulateModel(data, "Random Forest", 2.5, 0.96, 0.93, 0.92),
    simulateModel(data, "SVM", 3.0, 0.94, 0.91, 0.90),
    simulateModel(data, "KNN", 2.8, 0.92, 0.89, 0.88),
  ];

  const bestModel = models.reduce((a, b) => a.testAccuracy > b.testAccuracy ? a : b);

  const featureImportance = [
    { feature: "TSH", importance: 0.28 },
    { feature: "T4", importance: 0.18 },
    { feature: "T3", importance: 0.16 },
    { feature: "FTI", importance: 0.12 },
    { feature: "TT4", importance: 0.10 },
    { feature: "Age", importance: 0.05 },
    { feature: "Goiter", importance: 0.04 },
    { feature: "Fatigue", importance: 0.03 },
    { feature: "Lithium", importance: 0.02 },
    { feature: "Tumor", importance: 0.01 },
    { feature: "Weight Change", importance: 0.01 },
  ];

  return {
    models,
    bestModel: bestModel.name,
    finalPrediction: bestModel.prediction,
    featureImportance,
  };
}
