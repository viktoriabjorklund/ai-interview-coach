"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
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
  // Enkel “target” för hur många frågor man tänker köra
  const TOTAL_QUESTIONS = 5;
  const searchParams = useSearchParams();

  const jobTitle = searchParams.get("role") || "";
  const company = searchParams.get("company") || "";
  const jobDescription = searchParams.get("jobDescription") || "";

  // Intervju-state
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [answer, setAnswer] = useState("");

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

  // Hämta första fråga direkt när sidan laddar
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
        history: [], // ingen historik första gången
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
      setError(err.message || "Något gick fel när första frågan skulle hämtas.");
    } finally {
      setLoading(false);
    }
  }

  // SUBMIT: användaren skickar sitt svar → få feedback + nästa fråga från API
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

      // Spara nästa fråga men visa den först när användaren klickar "Next question"
      setQueuedNextQuestion(data.next_question || "");

      setMode("feedback");
    } catch (err: any) {
      setError(err.message || "Något gick fel när feedback skulle hämtas.");
    } finally {
      setLoading(false);
    }
  }

  // NEXT QUESTION: gå vidare till queuedNextQuestion
  function handleNextQuestion() {
    if (!queuedNextQuestion) return;
    if (history.length >= TOTAL_QUESTIONS) return;

    setCurrentQuestion(queuedNextQuestion);
    setQueuedNextQuestion("");
    setAnswer("");
    setFeedback(null);
    setMode("answering");
  }

  const currentIndex = history.length; // hur många färdiga frågor
  const questionNumber = currentIndex + 1;

  return (
    <div className="flex min-h-screen flex-col bg-[#f3f4f6]">
      <Header />

      {/* Vänstra hörnet */}
      <div className="fixed left-10 top-24 z-20 space-y-2">
        <p className="mb-4 text-xl font-medium text-slate-700">
          Question {questionNumber} out of {TOTAL_QUESTIONS}
        </p>
        <button
          type="button"
          onClick={handleNextQuestion}
          disabled={
            loading ||
            !queuedNextQuestion ||
            history.length >= TOTAL_QUESTIONS ||
            mode !== "feedback"
          }
          className="rounded-md bg-slate-700 px-4 py-2 text-base font-medium text-white hover:bg-slate-900 disabled:opacity-60"
        >
          Next question
        </button>
      </div>

      {/* Main card */}
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
              // Visa AI:n “ideal answer” (outline) eller själva feedback-texten
              modelAnswer={
                feedback?.outline
                  ? feedback.outline.join("\n")
                  : feedback?.text ?? null
              }
              onAnswerChange={setAnswer}
              onSubmit={handleSubmitCurrent}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
