import React from "react";
import JobDescriptionForm from "../../components/JobDescriptionForm";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f3f4f6]">
      <Header />

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

      <Footer />
    </div>
  );
}
