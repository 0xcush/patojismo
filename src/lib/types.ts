export interface DayLog {
  date: string; // YYYY-MM-DD
  hasPeriod: boolean;
  flow?: "light" | "medium" | "heavy";
  symptoms?: string[];
  mood?: string;
  notes?: string;
}

export interface Method {
  id: string;
  name: string;
  category: "hormonal" | "barrier" | "natural" | "permanent" | "emergency";
  effectiveness: number; // percentage
  description: string;
  pros: string[];
  cons: string[];
  howItWorks: string;
}
