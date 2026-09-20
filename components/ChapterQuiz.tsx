"use client";

import { useState } from "react";
import type { Quiz } from "@/data/chapters";

export function ChapterQuiz({ quiz }: { quiz: Quiz }) {
  const [selected, setSelected] = useState<number | null>(null);
  return (
    <div className="quiz">
      <h3>{quiz.question}</h3>
      {quiz.options.map((option, index) => (
        <button className={selected === index ? "selected" : ""} key={option} onClick={() => setSelected(index)}>
          {String.fromCharCode(65 + index)}. {option}
        </button>
      ))}
      {selected !== null && (
        <div className="quiz-result">
          <b>{selected === quiz.answer ? "回答正确" : `再想一步：正确答案是 ${String.fromCharCode(65 + quiz.answer)}`}</b>
          <p>{quiz.explanation}</p>
        </div>
      )}
    </div>
  );
}
