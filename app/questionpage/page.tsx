"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import QuestionTemplate from "@/components/QuestionTemplate";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { getInterviewQuestion } from "@/services/interview-question-service";


// Typen på en historikpost som ditt API förväntar sig
type HistoryItem = {
  question: string;
  answer: string;
  feedback: string | null;
  score: number | null;
};

type Mode = "idle" | "answering" | "feedback";

export default function QuestionPage() {
  const TOTAL_QUESTIONS = 5;
  const searchParams = useSearchParams();

  const jobTitle = searchParams.get("role") || "";
  const company = searchParams.get("company") || "";
  const jobDescription = searchParams.get("jobDescription") || "";

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const router = useRouter();


  const [mode, setMode] = useState<Mode>("idle");

  const [feedback, setFeedback] = useState<{
    text: string;
    score: number | null;
    outline: string[] | null;
  } | null>(null);

  const [questionMeta, setQuestionMeta] = useState<{
    focus_area?: string;
    difficulty?: string;
    hint_for_next_question?: string;
    suggested_ideal_answer_outline?: string[];
  } | null>(null);

  const [queuedNextQuestion, setQueuedNextQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🟦 Hämta första frågan direkt
  useEffect(() => {
    fetchFirstQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchFirstQuestion() {
    setLoading(true);
    setError(null);
    setHistory([]);
    setAnswer("");
    setFeedback(null);
    setQueuedNextQuestion("");
    setMode("idle");

    try {
      const data = await getInterviewQuestion({
        jobTitle,
        company,
        jobDescription,
        history: [],
      });

      setCurrentQuestion(data.next_question || "");
      setQuestionMeta({
        focus_area: data.focus_area,
        difficulty: data.difficulty,
        hint_for_next_question: data.hint_for_next_question,
        suggested_ideal_answer_outline: data.suggested_ideal_answer_outline,
      });

      setMode("answering");
    } catch (err: any) {
      setError(err.message || "Something went wrong when fetching the question.");
    } finally {
      setLoading(false);
    }
  }

  // 🟩 När användaren skickar in sitt svar
  async function handleSubmitCurrent() {
    if (!currentQuestion || !answer.trim()) return;

    setLoading(true);
    setError(null);

    const newHistory: HistoryItem[] = [
      ...history,
      {
        question: currentQuestion,
        answer,
        feedback: feedback?.text ?? null,
        score: feedback?.score ?? null,
      },
    ];

    try {
      const data = await getInterviewQuestion({
        jobTitle,
        company,
        jobDescription,
        history: newHistory,
      });

      setHistory(newHistory);

      setFeedback({
        text: data.feedback_on_last_answer,
        score: data.score_on_last_answer,
        outline: data.suggested_ideal_answer_outline ?? null,
      });

      setQuestionMeta((prev) => ({
        ...(prev || {}),
        focus_area: data.focus_area,
        difficulty: data.difficulty,
        hint_for_next_question: data.hint_for_next_question,
        suggested_ideal_answer_outline: data.suggested_ideal_answer_outline,
      }));

      setQueuedNextQuestion(data.next_question || "");
      setMode("feedback");
    } catch (err: any) {
      setError(err.message || "Something went wrong when fetching feedback.");
    } finally {
      setLoading(false);
    }
  }

  // 🟨 Nästa fråga
  function handleNextQuestion() {
    if (!queuedNextQuestion) return;
    if (history.length >= TOTAL_QUESTIONS) return;

    setCurrentQuestion(queuedNextQuestion);
    setQueuedNextQuestion("");
    setAnswer("");
    setFeedback(null);
    setMode("answering");
  }

  const hasCompletedAll = history.length >= TOTAL_QUESTIONS && mode === "feedback";
  const primaryButtonLabel = hasCompletedAll ? "Back to home" : "Next question";

  function handlePrimaryButtonClick() {
    if (hasCompletedAll) {
      router.push("/homepage"); // eller den route du vill hem till
    } else {
      handleNextQuestion();
    }
  }

  const questionNumber =
  mode === "feedback"
    ? Math.max(1, Math.min(history.length, TOTAL_QUESTIONS)) // visa aktuell besvarad fråga
    : Math.min(history.length + 1, TOTAL_QUESTIONS);
 



  return (
    <div className="flex min-h-screen flex-col bg-[#f3f4f6]">
      <Header />

      {/* 🟦 LOADING OVERLAY */}
      {loading && (
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center">
            <svg
              className="animate-spin h-10 w-10 text-slate-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>

            <p className="mt-4 text-slate-600 text-sm">
              Generating your question...
            </p>
          </div>
        </div>
      )}

      {/* 🟩 MAIN CONTENT — visas endast när vi INTE laddar */}
      {!loading && (
        <>
          <div className="fixed left-10 top-24 z-20 space-y-2">
            <p className="mb-4 text-xl font-medium text-slate-700">
              Question {questionNumber} out of {TOTAL_QUESTIONS}
            </p>
            <button
              type="button"
              onClick={handlePrimaryButtonClick}
              disabled={
                !hasCompletedAll && (
                  loading ||
                  !queuedNextQuestion ||
                  history.length >= TOTAL_QUESTIONS ||
                  mode !== "feedback"
                )
              }
              className="rounded-md bg-slate-700 px-4 py-2 text-base font-medium text-white hover:bg-slate-900 disabled:opacity-60"
            >
              {primaryButtonLabel}
            </button>


          </div>

          <main className="flex flex-1 items-center justify-center px-4 py-10">
            <div className="mx-auto w-full max-w-4xl rounded-3xl bg-white px-10 py-12 shadow-md">
              <h1 className="mt-6 text-center text-2xl font-semibold leading-relaxed text-slate-900">
                AI Interview Practice
              </h1>

              {questionMeta && (
                <p className="mt-4 text-center text-sm text-gray-500">
                  Focus area: {questionMeta.focus_area} • Difficulty:{" "}
                  {questionMeta.difficulty}
                </p>
              )}

              {error && (
                <p className="mt-4 text-center text-sm text-red-600">{error}</p>
              )}

              <div className="mx-auto mt-8 max-w-sm">
                <QuestionTemplate
                  question={currentQuestion}
                  answer={answer}
                  submitted={mode === "feedback"}
                  modelAnswer={feedback?.text ?? null}
                  onAnswerChange={setAnswer}
                  onSubmit={handleSubmitCurrent}
                />
              </div>
            </div>
          </main>
        </>
      )}

      <Footer />
    </div>
  );
}
