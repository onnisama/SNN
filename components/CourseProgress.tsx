"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { chapters } from "@/data/chapters";

type ProgressContext = {
  completed: string[];
  percent: number;
  toggle: (slug: string) => void;
  isComplete: (slug: string) => boolean;
};

const Context = createContext<ProgressContext>({ completed: [], percent: 0, toggle: () => {}, isComplete: () => false });

export function CourseProgressProvider({ children }: { children: React.ReactNode }) {
  const [completed, setCompleted] = useState<string[]>([]);
  useEffect(() => {
    try { setCompleted(JSON.parse(localStorage.getItem("snn-progress") || "[]")); } catch { setCompleted([]); }
  }, []);
  const toggle = (slug: string) => {
    setCompleted(current => {
      const next = current.includes(slug) ? current.filter(item => item !== slug) : [...current, slug];
      localStorage.setItem("snn-progress", JSON.stringify(next));
      return next;
    });
  };
  const value = useMemo(() => ({
    completed,
    percent: Math.round((completed.length / chapters.length) * 100),
    toggle,
    isComplete: (slug: string) => completed.includes(slug)
  }), [completed]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export const useCourseProgress = () => useContext(Context);
