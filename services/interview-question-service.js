// services/interview-question-service.js
export async function getInterviewQuestion({
    jobTitle,
    company,
    jobDescription,
    history,
  }) {
    const res = await fetch("/api/interview-question", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jobTitle,
        company,
        jobDescription,
        history,
      }),
    });
  
    if (!res.ok) {
      let errorMessage = "Något gick fel";
  
      try {
        const err = await res.json();
        errorMessage = err.error || errorMessage;
      } catch {
        // ignore JSON parse error
      }
  
      throw new Error(errorMessage);
    }
  
    return await res.json();
  }
  