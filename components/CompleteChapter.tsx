"use client";

import { useCourseProgress } from "./CourseProgress";

export function CompleteChapter({ slug }: { slug: string }) {
  const { toggle, isComplete } = useCourseProgress();
  const complete = isComplete(slug);
  return <button aria-pressed={complete} className={`complete-button ${complete ? "complete" : ""}`} onClick={() => toggle(slug)}>{complete ? "已完成 · 点击撤销" : "标记本章完成"}</button>;
}
