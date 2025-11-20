// services/interviewProgressService.ts

const STORAGE_KEY = "ai-interview-progress-v1";

export type AnswerState = {
  answer: string;
  submitted: boolean;
  modelAnswer: string | null;
};

export type InterviewProgress = {
  currentIndex: number;
  answers: AnswerState[];
};

/**
 * Skapar en tom answer-array med rätt längd.
 */
export function createEmptyAnswers(questionCount: number): AnswerState[] {
  return Array.from({ length: questionCount }, () => ({
    answer: "",
    submitted: false,
    modelAnswer: null,
  }));
}

/**
 * Läser progress från localStorage.
 * Returnerar null om inget sparat eller ogiltigt.
 */
export function loadInterviewProgress(
  questionCount: number
): InterviewProgress | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);

    if (
      !parsed ||
      !Array.isArray(parsed.answers) ||
      typeof parsed.currentIndex !== "number"
    ) {
      return null;
    }

    // Längden måste matcha antalet frågor just nu
    if (parsed.answers.length !== questionCount) {
      return null;
    }

    const safeIndex = Math.min(
      Math.max(parsed.currentIndex, 0),
      questionCount - 1
    );

    return {
      currentIndex: safeIndex,
      answers: parsed.answers as AnswerState[],
    };
  } catch (err) {
    console.error("Kunde inte läsa interview progress från localStorage", err);
    return null;
  }
}

/**
 * Sparar progress till localStorage.
 */
export function saveInterviewProgress(progress: InterviewProgress): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (err) {
    console.error("Kunde inte spara interview progress till localStorage", err);
  }
}
