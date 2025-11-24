// services/study-plan-service.ts

export async function getStudyPlan({
  jobTitle,
  company,
  jobDescription,
}) {
  const res = await fetch("/api/study-plan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jobTitle, company, jobDescription }),
  });

  if (!res.ok) {
    let errorMessage = "Något gick fel";

    try {
      const err = await res.json();
      errorMessage = err.error || errorMessage;
    } catch {}

    throw new Error(errorMessage);
  }

  return await res.json();
}
