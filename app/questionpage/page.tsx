import React from "react";
import JobDescriptionForm from "../../components/JobDescriptionForm";
import QuestionTemplate from "@/components/QuestionTemplate";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function QuestionPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f3f4f6]">
      <Header />

      {/* Main card */}
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="mx-auto w-full max-w-4xl rounded-3xl bg-white px-10 py-12 shadow-md">
          <h1 className="text-center text-2xl font-semibold leading-relaxed text-slate-900">
            Sample Interview Questions
          </h1>
          <div className="mx-auto mt-8 max-w-sm">
            <QuestionTemplate />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
