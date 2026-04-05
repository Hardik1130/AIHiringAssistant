/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { X, MapPin, Plus, Sparkles, Loader2 } from "lucide-react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import { generateJobDescriptionApi } from "../../api/jobs.api";
import { finalizeJobApi } from "../../api/jobs.api";

const PostJob = ({ onClose }) => {
  const [jobTitle, setJobTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");
  const [minExp, setMinExp] = useState("");
  const [maxExp, setMaxExp] = useState("");
  const [employmentType, setEmploymentType] = useState("Full-Time");
  const [skills, setSkills] = useState(
    [],
    //   [
    //   "Java",
    //   "Spring Boot",
    //   "Spring Security",
    //   "Hibernate",
    //   "MySQL",
    //   "REST APIs",
    // ]
  );
  const [newSkill, setNewSkill] = useState("");
  const [showSkillInput, setShowSkillInput] = useState(false);
  const [generatedJob, setGeneratedJob] = useState(null);
  const [showGeneratedModal, setShowGeneratedModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // ❌ TypeScript type removed
  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
      setShowSkillInput(false);
    }
  };

  const handleSkillKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const generateJobDescription = async () => {
    if (!jobTitle || !department || !location || skills.length === 0) {
      toast.error(
        "Please fill in all required fields (Job Title, Department, Location, and at least one skill)",
      );
      return;
    }

    // Validate experience range
    const minExpNum = parseInt(minExp) || 0;
    const maxExpNum = parseInt(maxExp) || 0;
    if (minExpNum < 0 || maxExpNum < 0) {
      toast.error("Experience values cannot be negative");
      return;
    }
    if (minExpNum > maxExpNum) {
      toast.error(
        "Minimum experience cannot be greater than maximum experience",
      );
      return;
    }

    setIsGenerating(true);
    try {
      const payload = {
        title: jobTitle,
        department: department,
        minExperience: parseInt(minExp) || 0,
        maxExperience: parseInt(maxExp) || 0,
        employmentType: employmentType,
        location: location,
        skillsRequired: skills,
      };

      const response = await generateJobDescriptionApi(payload);

      if (response.data && !response.data.error) {
        setGeneratedJob(response.data.data);
        setShowGeneratedModal(true);
        toast.success(
          response.data.message ||
            "AI Job Description generated successfully (Draft)",
        );
      } else {
        toast.error(
          response.data?.message ||
            "Failed to generate job description. Please try again.",
        );
      }
    } catch (error) {
      console.error("Error generating job description:", error);
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while generating the job description. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const finalizeJob = async () => {
    if (!generatedJob || !generatedJob.jobId) {
      toast.error("Unable to finalize: job ID missing");
      return;
    }

    console.log("Finalizing job with ID:", generatedJob.jobId);

    try {
      const resp = await finalizeJobApi(generatedJob.jobId);
      if (resp.data && !resp.data.error) {
        toast.success(resp.data.message || "Job finalized successfully!");
      } else {
        toast.error(resp.data?.message || "Failed to finalize job.");
      }
    } catch (err) {
      console.error("Finalize job error", err);
      const msg = err.response?.data?.message || "Error finalizing job.";
      toast.error(msg);
    } finally {
      setShowGeneratedModal(false);
      onClose && onClose();
    }
  };

  // close on ESC
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose && onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const modal = (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 z-[9999] font-display text-slate-900 antialiased"
      style={{
        backgroundImage: `linear-gradient(rgba(35, 23, 15, 0.4), rgba(35, 23, 15, 0.4))`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      onClick={() => onClose && onClose()}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-2xl rounded-xl shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center shrink-0">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Post Job</h1>
            <p className="text-slate-500 text-sm mt-1">
              Fill in the details to create a new job opening
            </p>
          </div>
          <button
            onClick={() => onClose && onClose()}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto px-8 py-6 space-y-6">
          {/* Job Title */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">
              Job Title
            </label>
            <input
              className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="Enter Your Title"
            />
          </div>

          {/* Department & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Department
              </label>
              <div className="relative">
                <select
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none appearance-none"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                >
                  <option
                    value=""
                    disabled
                    selected={!department}
                    className="text-slate-400"
                  >
                    Select Department
                  </option>
                  <option value="Engineering">Engineering</option>
                  <option value="Product">Product</option>
                  <option value="Design">Design</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Finance">Finance</option>
                  <option value="Operations">Operations</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Location
              </label>
              <div className="relative">
                <input
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter Location"
                />
                <MapPin className="absolute right-3 top-3.5 w-5 h-5 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Experience Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Min Experience (Years)
              </label>
              <input
                className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                type="number"
                value={minExp}
                onChange={(e) => setMinExp(e.target.value)}
                placeholder="Enter Min Exp"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Max Experience (Years)
              </label>
              <input
                className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                type="number"
                value={maxExp}
                onChange={(e) => setMaxExp(e.target.value)}
                placeholder="Enter Max Exp"
              />
            </div>
          </div>

          {/* Employment Type */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">
              Employment Type
            </label>
            <div className="flex flex-wrap gap-2">
              {["Full-Time", "Part-Time", "Contract"].map((type) => (
                <button
                  key={type}
                  onClick={() => setEmploymentType(type)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    employmentType === type
                      ? "bg-[#ec5b13] text-white"
                      : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Skills Required */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700">
              Skills Required
            </label>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <div
                    key={skill}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-[#ec5b13] text-sm font-medium border border-primary/20"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-3 h-3 cursor-pointer" />
                    </button>
                  </div>
                ))}
              </div>

              {showSkillInput ? (
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={handleSkillKeyPress}
                  onBlur={() =>
                    newSkill.trim() === "" && setShowSkillInput(false)
                  }
                  autoFocus
                  placeholder="Enter a skill and press Enter..."
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm"
                />
              ) : (
                <button
                  onClick={() => setShowSkillInput(true)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-dashed border-slate-300 text-slate-500 text-sm font-medium hover:bg-slate-50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Skill
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}

        <div className="px-8 py-6 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-3 shrink-0 rounded-b-xl">
          {/* <button
            type="button"
            onClick={() => onClose && onClose()}
            className="flex-1 py-3 px-6 rounded-lg border border-slate-200 bg-white text-slate-700 font-semibold hover:bg-slate-50 transition-all"
          >
            Cancel
          </button> */}

          <button
            onClick={generateJobDescription}
            disabled={isGenerating}
            className="flex-1 flex items-center justify-center gap-2 hover:bg-primary/90 text-white font-semibold py-3 px-4 rounded-lg transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: "#ec5b13" }}
          >
            {isGenerating ? (
              <Loader2 className="w-5 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-5 h-4" />
            )}
            {isGenerating ? "Generating..." : "Generate Job Description"}
          </button>

          {/* <button
            className="flex-1 bg-slate-200 text-slate-400 font-semibold py-3 px-6 rounded-lg cursor-not-allowed"
            disabled
          >
            Finalize
          </button> */}
        </div>
      </div>
    </div>
  );

  // Generated Job Description Modal
  const generatedModal = generatedJob && showGeneratedModal && (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 z-[10000] font-display text-slate-900 antialiased"
      style={{
        backgroundImage: `linear-gradient(rgba(35, 23, 15, 0.4), rgba(35, 23, 15, 0.4))`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      onClick={() => setShowGeneratedModal(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-4xl rounded-xl shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center shrink-0">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Generated Job Description
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Review and finalize the AI-generated job description
            </p>
          </div>
          <button
            onClick={() => setShowGeneratedModal(false)}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto px-8 py-6 space-y-6">
          {/* Job Title */}
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-800">
              {generatedJob.title}
            </h2>
            <div className="flex flex-wrap gap-4 text-sm text-slate-600">
              <span>
                <strong>Department:</strong> {generatedJob.department}
              </span>
              <span>
                <strong>Location:</strong> {generatedJob.location}
              </span>
              <span>
                <strong>Experience:</strong> {generatedJob.minExperience}-
                {generatedJob.maxExperience} years
              </span>
              <span>
                <strong>Type:</strong> {generatedJob.employmentType}
              </span>
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-slate-700">
              Required Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {generatedJob.skillsRequired.split(",").map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-lg bg-primary/10 text-[#ec5b13] text-sm font-medium border border-primary/20"
                >
                  {skill.trim()}
                </span>
              ))}
            </div>
          </div>

          {/* Job Summary */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-slate-700">
              Job Summary
            </h3>
            <p className="text-slate-600 leading-relaxed">
              {generatedJob.jobSummary}
            </p>
          </div>

          {/* Responsibilities */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-slate-700">
              Responsibilities
            </h3>
            <div className="text-slate-600 leading-relaxed whitespace-pre-line">
              {generatedJob.responsibilities}
            </div>
          </div>

          {/* Qualifications */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-slate-700">
              Qualifications
            </h3>
            <div className="text-slate-600 leading-relaxed whitespace-pre-line">
              {generatedJob.qualifications}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-3 shrink-0 rounded-b-xl">
          <button
            onClick={() => setShowGeneratedModal(false)}
            className="flex-1 py-3 px-6 rounded-lg border border-slate-200 bg-white text-slate-700 font-semibold hover:bg-slate-50 transition-all"
          >
            Edit
          </button>

          <button
            onClick={finalizeJob}
            className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-lg shadow-green-600/20"
          >
            <Sparkles className="w-5 h-4" />
            Finalize Job Description
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(
    <>
      {modal}
      {generatedModal}
    </>,
    document.body,
  );
};

export default PostJob;
