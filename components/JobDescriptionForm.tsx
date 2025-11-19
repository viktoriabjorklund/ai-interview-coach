"use client";

import React from "react";

function JobDescriptionForm() {
  return (
    <form className="mt-10 space-y-6">
      {/* Role */}
      <div className="space-y-1 text-sm">
        <label className="block font-medium text-slate-700">
          Role that you are applying for:
          <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Role..."
          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-brandBlue focus:outline-none focus:ring-1 focus:ring-brandBlue"
        />
      </div>

      {/* Company */}
      <div className="space-y-1 text-sm">
        <label className="block font-medium text-slate-700">
          Company that you are interviewing for:
          <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Company..."
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
          className="w-full resize-none rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-brandBlue focus:outline-none focus:ring-1 focus:ring-brandBlue"
        />
      </div>

      {/* Choose what to start with */}
      <div className="pt-4 text-center">
        <p className="mb-4 text-sm text-slate-700">
          Choose what to start with
        </p>
        <div className="flex justify-center gap-3">
          <button
            type="button"
            className="rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-900"
          >
            Studyplan
          </button>
          <button
            type="button"
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
