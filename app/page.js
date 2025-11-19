"use client";

import { useState } from "react";
import { getStudyPlan } from "./services/study-plan-service";
import { getInterviewQuestion } from "./services/interview-question-service";

export default function Page() {
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const [plan, setPlan] = useState(null);

  // Intervju-state
  const [history, setHistory] = useState([]); // { question, answer, feedback?, score? }[]
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const [mode, setMode] = useState("idle"); // "idle" | "answering" | "feedback"

  const [feedback, setFeedback] = useState(null); // { text, score, outline[] }
  const [questionMeta, setQuestionMeta] = useState(null); // { focus_area, difficulty, hint }
  const [queuedNextQuestion, setQueuedNextQuestion] = useState("");

  const [loading, setLoading] = useState(false);
  const [activeAction, setActiveAction] = useState(null); // "plan" | "questions" | null
  const [error, setError] = useState("");

  // --- STUDIEPLAN ---

  async function handleGenerateStudyPlan() {
    setLoading(true);
    setActiveAction("plan");
    setError("");
    setPlan(null);

    try {
      const data = await getStudyPlan({ jobTitle, company, jobDescription });
      setPlan(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setActiveAction(null);
    }
  }

  // --- INTERVJU: STARTA (första fråga) ---

  async function handleGenerateQuestions() {
    setLoading(true);
    setActiveAction("questions");
    setError("");

    // Nollställ all intervju-state
    setHistory([]);
    setCurrentQuestion("");
    setAnswer("");
    setFeedback(null);
    setQuestionMeta(null);
    setQueuedNextQuestion("");
    setMode("idle");

    try {
      const data = await getInterviewQuestion({
        jobTitle,
        company,
        jobDescription,
        history: [], // ingen historik första anropet
      });

      setCurrentQuestion(data.next_question || "");
      setQuestionMeta({
        focus_area: data.focus_area,
        difficulty: data.difficulty,
        hint_for_next_question: data.hint_for_next_question,
        suggested_ideal_answer_outline: data.suggested_ideal_answer_outline,
      });

      // första anropet kommer normalt inte ha feedback
      setMode("answering");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setActiveAction(null);
    }
  }

  // --- INTERVJU: FÅ FEEDBACK PÅ NUVARANDE SVAR ---

  async function handleGetFeedback() {
    if (!currentQuestion || !answer.trim()) return;

    setLoading(true);
    setActiveAction("questions");
    setError("");

    const newHistory = [
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
        outline: data.suggested_ideal_answer_outline,
      });

      setQuestionMeta((prev) => ({
        ...(prev || {}),
        focus_area: data.focus_area,
        difficulty: data.difficulty,
        hint_for_next_question: data.hint_for_next_question,
      }));

      // Viktigt: vi hämtar nästa fråga men visar den först när användaren klickar "Next question"
      setQueuedNextQuestion(data.next_question || "");

      // Nu är vi i feedback-läge: ingen mer input på denna fråga
      setMode("feedback");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setActiveAction(null);
    }
  }

  // --- INTERVJU: GÅ VIDARE TILL NÄSTA FRÅGA ---

  function handleNextQuestion() {
    if (!queuedNextQuestion) return;

    // Visa nästa fråga, rensa feedback & svar
    setCurrentQuestion(queuedNextQuestion);
    setQueuedNextQuestion("");
    setAnswer("");
    setFeedback(null);
    setMode("answering");
  }

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Studieplan & AI-intervjucoach</h1>

      {/* Input för roll */}
      <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
        <input
          className="w-full border rounded p-2"
          placeholder="Jobbtitel (t.ex. Frontend Engineer)"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
        />
        <input
          className="w-full border rounded p-2"
          placeholder="Företag (t.ex. Spotify)"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
        <textarea
          className="w-full border rounded p-2 min-h-[100px]"
          placeholder="Klistra in jobbeskrivning (valfritt)"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />

        <div className="flex gap-3">
          <button
            type="button"
            disabled={loading}
            className="px-4 py-2 border rounded"
            onClick={handleGenerateStudyPlan}
          >
            {loading && activeAction === "plan"
              ? "Genererar..."
              : "Generera studieplan"}
          </button>

          <button
            type="button"
            disabled={loading}
            className="px-4 py-2 border rounded"
            onClick={handleGenerateQuestions}
          >
            {loading && activeAction === "questions"
              ? "Genererar..."
              : currentQuestion
              ? "Starta om intervjun"
              : "Generera frågor"}
          </button>
        </div>
      </form>

      {error && <p className="text-red-600">{error}</p>}

      {/* STUDIEPLAN */}
      {plan && (
        <section className="mt-6 space-y-3">
          <h2 className="text-xl font-semibold">Focus Area</h2>
          <p>{plan.focus_area}</p>

          <h3 className="font-semibold mt-4">Key Skills to Practice</h3>
          <ul className="list-disc ml-6">
            {plan.key_skills?.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>

          <h3 className="font-semibold mt-4">Common Question types</h3>
          <ul className="list-disc ml-6">
            {plan.example_questions?.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>

          <h3 className="font-semibold mt-4">Preparation</h3>
          <ul className="list-disc ml-6">
            {plan.preparation?.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </section>
      )}

      {/* INTERVJU-DELEN */}
            {/* INTERVJU-DELEN */}
            {currentQuestion && (
        <section className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold">AI-intervju</h2>

          {/* KORT 1: AKTUELL FRÅGA */}
          <div className="border rounded p-4">
            {questionMeta && (
              <p className="text-sm text-gray-500">
                Område (för nuvarande fråga): {questionMeta.focus_area} • Svårighetsgrad:{" "}
                {questionMeta.difficulty}
              </p>
            )}
            <p className="mt-2 font-medium">{currentQuestion}</p>

            {questionMeta?.hint_for_next_question && mode === "answering" && (
              <p className="mt-2 text-sm text-gray-600">
                Hint: {questionMeta.hint_for_next_question}
              </p>
            )}
          </div>

          {/* MODE: svara på fråga */}
          {mode === "answering" && (
            <div className="space-y-2">
              <textarea
                className="w-full border rounded p-2 min-h-[120px]"
                placeholder="Skriv ditt svar här..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                onClick={handleGetFeedback}
                disabled={loading || !answer.trim()}
                className="px-4 py-2 border rounded"
              >
                {loading && activeAction === "questions"
                  ? "Analyserar svar..."
                  : "Få feedback"}
              </button>
            </div>
          )}

          {/* MODE: feedback + knapp för nästa fråga */}
          {mode === "feedback" && feedback && (
            <div className="space-y-4">
              {/* KORT 2: FEEDBACK PÅ FÖRRA FRÅGAN */}
              <div className="border rounded p-4 bg-gray-50">
                <h3 className="font-semibold">Feedback på ditt svar</h3>

                {/* Visa tydligt vilken fråga feedbacken gäller */}
                <p className="mt-1 text-sm text-gray-500">
                  Fråga du svarade på:
                </p>
                <p className="mt-1 italic">"{history.at(-1)?.question}"</p>

                {questionMeta && (
                  <p className="mt-1 text-sm text-gray-500">
                    Område: {questionMeta.focus_area} • Svårighetsgrad:{" "}
                    {questionMeta.difficulty}
                  </p>
                )}

                <p className="mt-2">{feedback.text}</p>

                {typeof feedback.score === "number" && (
                  <p className="mt-1 text-sm text-gray-700">
                    Betyg: {feedback.score}/10
                  </p>
                )}
              </div>

              {/* NEXT QUESTION */}
              <button
                type="button"
                onClick={handleNextQuestion}
                disabled={loading || !queuedNextQuestion}
                className="px-4 py-2 border rounded"
              >
                {loading && activeAction === "questions"
                  ? "Laddar nästa fråga..."
                  : "Next question"}
              </button>
            </div>
          )}
        </section>
      )}

    </main>
  );
}
