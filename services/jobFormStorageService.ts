// services/jobFormStorageService.ts

const STORAGE_KEY = "jobFormData";

/**
 * Typ för datan vi sparar
 */
export type JobFormData = {
  role: string;
  company: string;
  jobDescription: string;
};

/**
 * Läs från localStorage
 */
export function loadJobFormData(): JobFormData | null {
  if (typeof window === "undefined") return null; // SSR-skydd

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as JobFormData;
  } catch (err) {
    console.error("Failed to load job form data:", err);
    return null;
  }
}

/**
 * Spara till localStorage
 */
export function saveJobFormData(data: JobFormData) {
  if (typeof window === "undefined") return; // SSR-skydd

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error("Failed to save job form data:", err);
  }
}

/**
 * Rensa localStorage
 */
export function clearJobFormData() {
  if (typeof window === "undefined") return; // SSR-skydd

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error("Failed to clear job form data:", err);
  }
}
