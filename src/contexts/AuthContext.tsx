import React, { createContext, useContext, useState, ReactNode } from "react";

interface User {
  name: string;
  type: "patient" | "admin";
  email?: string;
  phone?: string;
  licenseNumber?: string;
  password?: string;
}

interface PredictionHistoryEntry {
  id: string;
  date: string;
  prediction: string;
  bestModel: string;
  accuracy: number;
  tsh: number;
  t3: number;
  t4: number;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  register: (user: User) => void;
  resetPassword: (emailPhone: string, newPassword: string) => void;
  registeredUsers: User[];
  predictionHistory: PredictionHistoryEntry[];
  addPrediction: (entry: PredictionHistoryEntry) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Store registered users for validation
const defaultUsers: User[] = [];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem("thyro_users");
    return saved ? JSON.parse(saved) : defaultUsers;
  });
  const [predictionHistory, setPredictionHistory] = useState<PredictionHistoryEntry[]>(() => {
    const saved = localStorage.getItem("thyro_predictions");
    return saved ? JSON.parse(saved) : [];
  });

  const login = (u: User) => setUser(u);
  const logout = () => setUser(null);
  const register = (u: User) => {
    setRegisteredUsers((prev) => {
      const next = [...prev, u];
      localStorage.setItem("thyro_users", JSON.stringify(next));
      return next;
    });
  };
  const resetPassword = (emailPhone: string, newPassword: string) => {
    setRegisteredUsers((prev) => {
      const next = prev.map((u) =>
        u.email === emailPhone || u.phone === emailPhone
          ? { ...u, password: newPassword }
          : u
      );
      localStorage.setItem("thyro_users", JSON.stringify(next));
      return next;
    });
  };
  const addPrediction = (entry: PredictionHistoryEntry) => {
    setPredictionHistory((prev) => {
      const next = [entry, ...prev];
      localStorage.setItem("thyro_predictions", JSON.stringify(next));
      return next;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, resetPassword, registeredUsers, predictionHistory, addPrediction }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
