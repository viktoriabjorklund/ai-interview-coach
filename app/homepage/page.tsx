import React from "react";
import JobDescriptionForm from "../../components/JobDescriptionForm";


export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f3f4f6]">
      {/* Top text */}
      <div className="px-8 pt-6 text-sm font-medium text-slate-400">
        Start view
      </div>

      {/* Navbar */}
      <header className="mt-2 bg-brandBlue text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-8 py-4">
          <span className="text-xl font-semibold tracking-wide">
            TECH COACH
          </span>

          <button
            type="button"
            className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-md border border-white/30"
          >
            <span className="h-0.5 w-5 bg-white" />
            <span className="h-0.5 w-5 bg-white" />
            <span className="h-0.5 w-5 bg-white" />
          </button>
        </div>
      </header>

      {/* Main card */}
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="mx-auto w-full max-w-4xl rounded-3xl bg-white px-10 py-12 shadow-md">
          <h1 className="text-center text-2xl font-semibold leading-relaxed text-slate-900">
            Welcome to Tech Coach – your personal coach
            <br />
            for learning and practicing for technical
            <br />
            interviews!
          </h1>

          <div className="mx-auto mt-8 max-w-sm">
            <JobDescriptionForm />
          </div>
        </div>
      </main>

      {/* Bottom bar (sen kan vi byta mot riktig wave-SVG) */}
      <div className="relative mt-4 h-16 overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 h-16 bg-brandBlue" />
      </div>
    </div>
  );
}
