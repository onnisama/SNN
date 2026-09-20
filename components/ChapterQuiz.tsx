"use client";

import { useState } from "react";
import type { Quiz } from "@/data/chapters";

export function ChapterQuiz({ quizzes }: { quizzes: Quiz[] }) {
  const [selected, setSelected] = useState<Record<number, number>>({});
  return (
    <div className="quiz">
      <div className="quiz-head"><span>本章检测</span><b>{Object.keys(selected).length}/{quizzes.length} 已作答</b></div>
      {quizzes.map((quiz, quizIndex) => {
        const choice = selected[quizIndex];
        return <div className="quiz-item" key={quiz.question}>
          <h3><span>{String(quizIndex + 1).padStart(2, "0")}</span>{quiz.question}</h3>
          {quiz.options.map((option, index) => (
            <button className={choice === index ? "selected" : ""} key={option} onClick={() => setSelected(current => ({ ...current, [quizIndex]: index }))}>
              {String.fromCharCode(65 + index)}. {option}
            </button>
          ))}
          {choice !== undefined && (
            <div className="quiz-result">
              <b>{choice === quiz.answer ? "回答正确" : `再想一步：正确答案是 ${String.fromCharCode(65 + quiz.answer)}`}</b>
              <p>{quiz.explanation}</p>
            </div>
          )}
        </div>;
      })}
    </div>
  );
}
