"use client";

import React, { useState, useEffect } from "react";
import QuestionTemplate from "@/components/QuestionTemplate";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import {
  createEmptyAnswers,
  loadInterviewProgress,
  saveInterviewProgress,
  type AnswerState,
} from "@/services/interviewProgressService";

export default function QuestionPage() {
  // Hårdkodade frågor
  const questions = [
    "What's the difference between a relational and non-relational database?",
    "Explain the concept of REST and when you would use it.",
    "How would you design a scalable API for a social media feed?",
  ];

  const [answers, setAnswers] = useState<AnswerState[]>(
    () => createEmptyAnswers(questions.length)
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex];
  const currentState = answers[currentIndex] || {
    answer: "",
    submitted: false,
    modelAnswer: null,
  };

  // LÄS FRÅN LOCALSTORAGE VID LADDNING
  useEffect(() => {
    const loaded = loadInterviewProgress(questions.length);
    if (loaded) {
      setAnswers(loaded.answers);
      setCurrentIndex(loaded.currentIndex);
    }
  }, [questions.length]);

  // SPARA TILL LOCALSTORAGE NÄR NÅGOT ÄNDRAS
  useEffect(() => {
    saveInterviewProgress({
      currentIndex,
      answers,
    });
  }, [currentIndex, answers]);

  // Hantera textändringar
  function handleAnswerChange(value: string) {
    setAnswers((prev) => {
      const copy = [...prev];
      copy[currentIndex] = {
        ...copy[currentIndex],
        answer: value,
      };
      return copy;
    });
  }

  // När användaren klickar Submit
  function handleSubmitCurrent() {
    setAnswers((prev) => {
      const copy = [...prev];
      copy[currentIndex] = {
        ...copy[currentIndex],
        submitted: true,
        // Här kan du senare stoppa in RIKTIGT AI-svar istället för mock
        modelAnswer:
          copy[currentIndex].modelAnswer ??
          "Mocked model answer for this question.",
      };
      return copy;
    });
  }

  function handleNextQuestion() {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f3f4f6]">
      <Header />

      {/* Vänstra hörnet */}
      <div className="fixed left-10 top-24 z-20 space-y-2">
        <p className="mb-4 text-xl font-medium text-slate-700">
          Question {currentIndex + 1} out of {totalQuestions}
        </p>
        <button
          type="button"
          onClick={handleNextQuestion}
          disabled={currentIndex >= totalQuestions - 1}
          className="rounded-md bg-slate-700 px-4 py-2 text-base font-medium text-white hover:bg-slate-900 disabled:opacity-60"
        >
          Next question
        </button>
      </div>

      {/* Main card */}
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="mx-auto w-full max-w-4xl rounded-3xl bg-white px-10 py-12 shadow-md">
          <h1 className="mt-6 text-center text-2xl font-semibold leading-relaxed text-slate-900">
            Sample Interview Questions
          </h1>

          <div className="mx-auto mt-8 max-w-sm">
            <QuestionTemplate
              question={currentQuestion}
              answer={currentState.answer}
              submitted={currentState.submitted}
              modelAnswer={currentState.modelAnswer}
              onAnswerChange={handleAnswerChange}
              onSubmit={handleSubmitCurrent}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
