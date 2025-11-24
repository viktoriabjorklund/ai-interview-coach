"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  loadJobFormData,
  saveJobFormData,
  type JobFormData,
} from "@/services/jobFormStorageService";

function JobDescriptionForm() {
  const router = useRouter();

  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  // 🟦 Ladda tidigare sparade värden vid first render
  useEffect(() => {
    const saved = loadJobFormData();
    if (saved) {
      setRole(saved.role);
      setCompany(saved.company);
      setJobDescription(saved.jobDescription);
    }
  }, []);

  // 🟩 Spara till localStorage varje gång något ändras
  useEffect(() => {
    const data: JobFormData = { role, company, jobDescription };
    saveJobFormData(data);
  }, [role, company, jobDescription]);

  function handleQuestionsClick() {
    if (!role.trim() || !company.trim()) {
      alert("Fyll i både role och company innan du går vidare till frågor.");
      return;
    }

    const params = new URLSearchParams({
      role: role.trim(),
      company: company.trim(),
    });

    if (jobDescription.trim()) {
      params.set("jobDescription", jobDescription.trim());
    }

    router.push(`/questionpage?${params.toString()}`);
  }

  function handleStudyplanClick() {
    if (!role.trim() || !company.trim()) {
      alert("Fyll i både role och company innan du går vidare till studieplan.");
      return;
    }

    const params = new URLSearchParams({
      role: role.trim(),
      company: company.trim(),
    });

    if (jobDescription.trim()) {
      params.set("jobDescription", jobDescription.trim());
    }

    router.push(`/studyplan?${params.toString()}`);
  }

  return (
    <form className="mt-10 space-y-6" onSubmit={(e) => e.preventDefault()}>
      {/* Role */}
      <div className="space-y-1 text-sm">
        <label className="block font-medium text-slate-700">
          Role that you are applying for:
        </label>
        <input
          type="text"
          placeholder="Role..."
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-brandBlue focus:outline-none focus:ring-1 focus:ring-brandBlue"
        />
      </div>

      {/* Company */}
      <div className="space-y-1 text-sm">
        <label className="block font-medium text-slate-700">
          Company that you are interviewing for:
        </label>
        <input
          type="text"
          placeholder="Company..."
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-brandBlue focus:outline-none focus:ring-1 focus:ring-brandBlue"
        />
      </div>

      {/* Job description */}
      <div className="space-y-1 text-sm">
        <label className="block font-medium text-slate-700">
          Fill in the actual job description (optional)
        </label>
        <textarea
          rows={4}
          placeholder="Copy paste your text in here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          className="w-full resize-none rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-brandBlue focus:outline-none focus:ring-1 focus:ring-brandBlue"
        />
      </div>

      {/* Buttons */}
      <div className="pt-4 text-center">
        <p className="mb-4 text-sm text-slate-700">
          Choose what to start with
        </p>
        <div className="flex justify-center gap-3">
          <button
            type="button"
            onClick={handleStudyplanClick}
            className="rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-900"
          >
            Studyplan
          </button>
          <button
            type="button"
            onClick={handleQuestionsClick}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
          >
            Questions
          </button>
        </div>
      </div>
    </form>
  );
}

export default JobDescriptionForm;
