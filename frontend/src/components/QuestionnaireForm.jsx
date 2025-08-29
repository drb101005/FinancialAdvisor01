import React, { useState } from "react";
import api from "../api/apiClient";

const questions = [
  "q1","q2","q3","q4","q5","q6","q7","q8","q9","q10","q11"
];

const scale = [
  { v: 0, label: "Strongly Disagree" },
  { v: 1, label: "Disagree" },
  { v: 2, label: "Neutral" },
  { v: 3, label: "Agree" },
  { v: 4, label: "Strongly Agree" },
];

export default function QuestionnaireForm() {
  const [answers, setAnswers] = useState(Object.fromEntries(questions.map(q => [q, 2])));
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErr("");
    setResult(null);
    try {
      const payload = {};
      questions.forEach((q) => { payload[q] = Number(answers[q]); });
      const { data } = await api.post("/profile/evaluate/", payload);
      setResult(data?.traits || {});
    } catch {
      setErr("Failed to evaluate questionnaire.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen px-4 md:px-8 py-10 text-white bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
          Investor Questionnaire
        </h1>

        <form onSubmit={submit} className="space-y-6 bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl">
          <div className="space-y-5">
            {questions.map((q, idx) => (
              <div key={q} className="border-b border-white/10 pb-5">
                <div className="mb-3 font-medium">Question {idx + 1}</div>
                <div className="flex flex-wrap gap-3">
                  {scale.map((s) => (
                    <label key={s.v} className={`px-3 py-2 rounded-xl border ${Number(answers[q])===s.v ? "border-emerald-400 bg-emerald-400/20" : "border-white/20 bg-white/5"} cursor-pointer`}>
                      <input
                        type="radio"
                        name={q}
                        value={s.v}
                        checked={Number(answers[q]) === s.v}
                        onChange={(e) => setAnswers((a) => ({ ...a, [q]: Number(e.target.value) }))}
                        className="hidden"
                      />
                      <span className="text-sm">{s.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {err && <div className="text-red-300">{err}</div>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Evaluate"}
          </button>
        </form>

        {result && (
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl">
            <div className="mb-3 text-xl font-semibold">Updated Traits</div>
            <pre className="text-sm bg-white/5 p-4 rounded-xl overflow-x-auto">{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
