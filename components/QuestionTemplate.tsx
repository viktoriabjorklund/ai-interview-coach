"use client";

import React from "react";

type QuestionTemplateProps = {
  question: string;
  answer: string;
  submitted: boolean;
  modelAnswer: string | null;
  onAnswerChange: (value: string) => void;
  onSubmit: () => void;
};

function QuestionTemplate({
  question,
  answer,
  submitted,
  modelAnswer,
  onAnswerChange,
  onSubmit,
}: QuestionTemplateProps) {
  // Fallback om modelAnswer är null (t.ex. första gången)
  const fallbackModelAnswer =
    "A relational database organizes data into tables with rows and columns and uses SQL and relations between tables. " +
    "A non-relational (NoSQL) database är mer flexibel, t.ex. dokument-, nyckel-värde- eller grafdatabaser, och passar ofta bättre för horisontell skalning och ostrukturerad data.";

  const finalModelAnswer = modelAnswer ?? fallbackModelAnswer;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!answer.trim()) return;
    onSubmit();
  }

  return (
    <div className="mt-10 space-y-6">
      {/* FORM-LÄGE */}
      {!submitted && (
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md border border-slate-200 bg-[#195383] px-8 py-10">
            <p className="text-center text-xl font-medium text-white">
              {question}
            </p>
          </div>

          <div className="space-y-1 text-base">
            <label className="block font-medium text-slate-700">
              Provide your answer:
            </label>
            <textarea
              rows={4}
              placeholder="Copy paste your text in here..."
              className="w-full resize-none rounded-md border border-slate-200 px-3 py-2 text-base shadow-sm focus:border-brandBlue focus:outline-none focus:ring-1 focus:ring-brandBlue"
              value={answer}
              onChange={(e) => onAnswerChange(e.target.value)}
            />
          </div>

          <div className="pt-4 text-center">
            <div className="flex justify-center gap-3">
              <button
                type="submit"
                className="rounded-md bg-slate-700 px-4 py-2 text-base font-medium text-white hover:bg-slate-900 disabled:opacity-60"
                disabled={!answer.trim()}
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      )}

      {/* SUBMITTAD LÄGE */}
      {submitted && (
        <div className="space-y-4">
          <p className="text-sm font-medium text-slate-600">Q: {question}</p>

          {/* Användarens svar */}
          <div className="rounded-md bg-slate-100 px-4 py-4">
            <p className="mb-2 text-base font-semibold text-slate-600">
              Your answer
            </p>
            <p className="whitespace-pre-wrap text-base text-slate-800">
              {answer}
            </p>
          </div>

          {/* Modellens svar */}
          <div className="rounded-md bg-[#195383] px-4 py-4">
            <p className="mb-2 text-base font-semibold text-slate-100">
              Feedback (mock)
            </p>
            <p className="whitespace-pre-wrap text-base text-white">
              {finalModelAnswer}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuestionTemplate;
