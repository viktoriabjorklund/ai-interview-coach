"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getStudyPlan } from "@/services/study-plan-service";

type QuestionGroup = {
  heading: string;
  items: string[];
};

type StudyPlan = {
  focus_area: string;
  key_skills: string[][]; // 2 kolumner
  question_types: {
    groups: QuestionGroup[];
  };
  preparation: string[];
};


const StudyPlanPage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const jobTitle = searchParams.get("role") || "";
  const company = searchParams.get("company") || "";
  const jobDescription = searchParams.get("jobDescription") || "";

  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hämta plan från API när sidan laddar
  useEffect(() => {
    if (!jobTitle || !company) return;

    async function fetchPlan() {
      setLoading(true);
      setError(null);
      try {
        const data = await getStudyPlan({
          jobTitle,
          company,
          jobDescription,
        });
        setPlan(data);
      } catch (err: any) {
        setError(
          err.message ||
            "Något gick fel när studieplanen skulle genereras."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchPlan();
  }, [jobTitle, company, jobDescription]);


const title = "Study plan";

const intro = {
  icon: "🎯",
  title: "What This Interview Will Focus On",
  body:
    plan?.focus_area ||
    "We will generate an overview of what this interview is likely to focus on based on your role and company.",
};

const keySkills = {
  icon: "🧠",
  title: "Key Skills to Practice",
  columns: plan?.key_skills ?? [[], []], // ⬅ nu direkt från modellen
};

const questionTypes = {
  icon: "❓",
  title: "Common Question Types",
  groups: plan?.question_types?.groups ?? [], // ⬅ direkt från modellen
};

const howToPrepare = {
  icon: "🛠️",
  title: "How to Prepare",
  items: plan?.preparation || [],
};


  // 👇 NY: handler för att hoppa vidare till frågesidan
  function handleGoToQuestions() {
    if (!jobTitle.trim() || !company.trim()) {
      alert("Saknar role/company i URL:en – gå tillbaka och fyll i formuläret.");
      return;
    }

    const params = new URLSearchParams({
      role: jobTitle.trim(),
      company: company.trim(),
    });

    if (jobDescription.trim()) {
      params.set("jobDescription", jobDescription.trim());
    }

    router.push(`/questionpage?${params.toString()}`);
  }

  return (
    <div className="min-h-screen bg-[#f2f4f7] flex flex-col">
      <Header />

      <main className="flex-1 flex justify-center px-4 py-10 md:py-14">
        <div className="w-full max-w-5xl">
          <div className="bg-white rounded-3xl shadow-md px-6 py-8 md:px-12 md:py-10 max-h-[70vh] overflow-y-auto">
            {/* Titel */}
            <h1 className="text-center text-2xl md:text-3xl font-semibold text-slate-800 mb-2">
              {title}
            </h1>
            {jobTitle && company && (
              <p className="text-center text-sm text-slate-500 mb-6">
                For role <span className="font-semibold">{jobTitle}</span> at{" "}
                <span className="font-semibold">{company}</span>
              </p>
            )}

            {loading && (
              <p className="text-center text-sm text-slate-600">
                Genererar studieplan...
              </p>
            )}

            {error && (
              <p className="text-center text-sm text-red-600 mb-4">
                {error}
              </p>
            )}

            {!loading && !error && (
              <>
                {/* Intro */}
                <section className="mb-10 text-center">
                  <h2 className="text-lg md:text-xl font-semibold text-slate-800 mb-2">
                    <span className="mr-1">{intro.icon}</span>
                    {intro.title}
                  </h2>
                  <p className="max-w-2xl mx-auto text-sm md:text-base text-slate-700 leading-relaxed">
                    {intro.body}
                  </p>
                </section>

                {/* Key skills */}
                <section className="mb-10">
                  <h2 className="text-center text-lg md:text-xl font-semibold text-slate-800 mb-4">
                    <span className="mr-1">{keySkills.icon}</span>
                    {keySkills.title}
                  </h2>

                  <div className="flex flex-col md:flex-row md:justify-center gap-6 text-sm md:text-base text-slate-700">
                    {keySkills.columns.map((col, idx) => (
                      <ul
                        key={idx}
                        className="list-disc list-outside mx-6 space-y-1"
                      >
                        {col.map((skill) => (
                          <li key={skill}>{skill}</li>
                        ))}
                      </ul>
                    ))}
                  </div>
                </section>

                {/* Question types */}
                <section className="mb-10">
                  <h2 className="text-center text-lg md:text-xl font-semibold text-slate-800 mb-6">
                    <span className="mr-1">{questionTypes.icon}</span>
                    {questionTypes.title}
                  </h2>

                  <div className="grid md:grid-cols-3 gap-8 text-sm md:text-base text-slate-700">
                    {questionTypes.groups.map((group) => (
                      <div key={group.heading}>
                        <p className="font-semibold mb-2">{group.heading}</p>
                        <ul className="list-disc list-outside ml-5 space-y-1">
                          {group.items.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>

                {/* How to prepare */}
                <section>
                  <h2 className="text-center text-lg md:text-xl font-semibold text-slate-800 mb-4">
                    <span className="mr-1">{howToPrepare.icon}</span>
                    {howToPrepare.title}
                  </h2>
                  <ul className="max-w-3xl mx-auto list-disc list-outside ml-6 text-sm md:text-base text-slate-700 space-y-1">
                    {howToPrepare.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>

                {/* 👇 NY: knapp längst ner */}
                <div className="mt-10 flex justify-center">
                  <button
                    type="button"
                    onClick={handleGoToQuestions}
                    className="rounded-md bg-slate-800 px-6 py-2 text-sm md:text-base font-medium text-white hover:bg-slate-900"
                  >
                    Practice interview questions
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StudyPlanPage;
