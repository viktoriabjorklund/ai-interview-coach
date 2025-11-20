"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const studyPlanMock = {
  title: "Study plan",
  intro: {
    icon: "🎯",
    title: "What This Interview Will Focus On",
    body: "They want to understand how well you know the core frontend fundamentals, how you approach problems, and whether you can explain your reasoning clearly. Communication and code readability matter just as much as solving the task.",
  },
  keySkills: {
    icon: "🧠",
    title: "Key Skills to Practice",
    columns: [
      [
        "HTML & CSS fundamentals",
        "JavaScript basics (arrays, loops)",
        "DOM manipulation & event handling",
      ],
      [
        "React basics (components, state)",
        "Debugging & thinking out loud",
        "Structuring answers clearly",
      ],
    ],
  },
  questionTypes: {
    icon: "❓",
    title: "Common Question Types",
    groups: [
      {
        heading: "1. Technical",
        items: [
          "“Explain how useState works”",
          "“Walk me through how you’d build a to-do app”",
        ],
      },
      {
        heading: "2. Behavioral",
        items: [
          "“Tell me about a time when…”",
          "“Describe a challenge you handled…”",
        ],
      },
      {
        heading: "3. Practical",
        items: [
          "“Build a small component”",
          "“Filter or map an array of objects”",
        ],
      },
    ],
  },
  howToPrepare: {
    icon: "🛠️",
    title: "How to Prepare",
    items: [
      "Prepare 2 behavioral stories (a challenge, something you learned).",
      "Refresh the top 5 concepts: array, functions, React components, state, CSS basics.",
      "Build 1–2 tiny components to warm up (input fields, list).",
      "Re-read the job ad and highlight required tech.",
    ],
  },
};

const StudyPlanPage: React.FC = () => {
  const { title, intro, keySkills, questionTypes, howToPrepare } =
    studyPlanMock;

  return (
    <div className="min-h-screen bg-[#f2f4f7] flex flex-col">
      <Header />

      <main className="flex-1 flex justify-center px-4 py-10 md:py-14">
        {/* Yttre container som centrerar kortet */}
        <div className="w-full max-w-5xl">
          {/* Själva vita rektangeln som ska vara scrollbar */}
          <div className="bg-white rounded-3xl shadow-md px-6 py-8 md:px-12 md:py-10 max-h-[70vh] overflow-y-auto">
            {/* Titel */}
            <h1 className="text-center text-2xl md:text-3xl font-semibold text-slate-800 mb-8">
              {title}
            </h1>

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
          </div>
        </div>
      </main>
      <Footer/>
    </div>
  );
};

export default StudyPlanPage;
