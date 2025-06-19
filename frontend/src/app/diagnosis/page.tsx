"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const questions = [
  { id: 1, text: "朝型ですか？夜型ですか？", left: "朝型", right: "夜型" },
  { id: 2, text: "海が好き？山が好き？", left: "海", right: "山" },
  { id: 3, text: "犬派？猫派？", left: "犬", right: "猫" },
];

export default function DiagnosePage() {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const router = useRouter();

  const handleAnswer = (choice: string) => {
    const updatedAnswers = [...answers, choice];
    if (index + 1 < questions.length) {
      setAnswers(updatedAnswers);
      setIndex(index + 1);
    } else {
      // 最後の質問が終わったら結果表示（ここでは一旦アラート）
      alert("診断結果: " + updatedAnswers.join(", "));
      // router.push("/result") なども可能
    }
  };

  const current = questions[index];

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h2>診断質問 {index + 1} / {questions.length}</h2>
      <p style={{ fontSize: "1.2rem" }}>{current.text}</p>
      <div style={{ marginTop: "2rem", display: "flex", justifyContent: "center", gap: "2rem" }}>
        <button onClick={() => handleAnswer(current.left)}>{current.left}</button>
        <button onClick={() => handleAnswer(current.right)}>{current.right}</button>
      </div>
    </div>
  );
}
