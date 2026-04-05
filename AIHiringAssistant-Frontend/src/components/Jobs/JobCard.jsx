import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { applyForJobApi } from "../../api/jobs.api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const JobCard = ({ job }) => {
  const [open, setOpen] = useState(false);
  const [applied, setApplied] = useState(job.hasApplied || false);
  const navigate = useNavigate();
  const { isHR } = useAuth();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleNavigateToApplicants = () => {
    if (!isHR()) return;
    navigate("/applicants", { state: { jobId: job.job.jobId } });
  };

  const handleApply = async () => {
    try {
      console.log("The Job is :-", job);
      const response = await applyForJobApi(job.job.jobId);
      if (response.data.error === false) {
        setApplied(true);
        toast.success("Applied successfully!");
      } else {
        toast.error(response.data.message || "Failed to apply");
      }
    } catch (err) {
      // toast.error("Profile incomplete. Please complete your profile before applying.");
      console.error(err);
      navigate("/profile");
    }
  };
  return (
    <div
      key={job.job.id}
      className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 p-6 rounded-3xl hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-black/20 transition-all group"
    >
      {/* Top */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/5 rounded-2xl">
            <span className="material-symbols-outlined text-primary">work</span>
          </div>
          <div>
            <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
              {job.job.title}
            </h3>
            <p className="text-sm text-gray-500">
              {job.job.department} • {job.job.location}
            </p>
          </div>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${job.job.finalized
              ? "bg-emerald-500/10 text-emerald-500"
              : "bg-gray-100 dark:bg-white/10 text-gray-400"
            }`}
        >
          {job.job.finalized ? "Active" : "Draft"}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 border-y border-gray-50 dark:border-white/5 py-4 my-4">
        {/* applicants block – clickable for HR */}
        <div
          className={`text-center ${isHR() ? "cursor-pointer" : "cursor-not-allowed opacity-60"}`}
          onClick={handleNavigateToApplicants}
          role={isHR() ? "button" : "presentation"}
          aria-disabled={!isHR()}
        >
          <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">
            Applicants
          </p>
          <p
            className={`text-xl font-bold ${isHR() ? "text-primary hover:underline" : ""
              }`}
          >
            {job.totalApplicants}
          </p>
        </div>

        <div className="text-center border-x border-gray-50 dark:border-white/5">
          <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">
            Posted
          </p>
          <p className="text-sm font-bold text-gray-600 dark:text-gray-300">
            {job.posted}
          </p>
        </div>

        <div className="text-center">
          <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">
            Experience
          </p>
          <p className="text-xs font-bold text-gray-600 dark:text-gray-300 truncate px-1">
            {job.job.minExperience}-{job.job.maxExperience} years
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        {/* <div className="flex -space-x-2">
          {[1, 2, 3].map((n) => (
            <img
              key={n}
              src={`https://i.pravatar.cc/100?u=${job.job.id}${n}`}
              alt="candidate"
              className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-900"
            />
          ))}
          <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-[10px] font-bold text-gray-400">
            +12
          </div>
        </div> */}

        <div className="flex w-full justify-between gap-2">
          <button
            onClick={handleOpen}
            className="px-4 py-2 bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 rounded-xl text-sm font-bold hover:bg-gray-200 dark:hover:bg-white/20 transition-all"
          >
            Read More
          </button>
          <button
            onClick={applied ? undefined : handleApply}
            disabled={applied}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all float-right ${applied
                ? "bg-green-600 text-white cursor-not-allowed"
                : "bg-[#ec5b13] text-white hover:bg-green-700"
              }`}
          >
            {applied ? "Applied" : "Easy Apply"}
          </button>
        </div>
      </div>

      {/* Modal */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">{job.job.title}</h2>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent>
          <div className="space-y-4">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300">
                  Department
                </h3>
                <p>{job.job.department}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300">
                  Location
                </h3>
                <p>{job.job.location}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300">
                  Employment Type
                </h3>
                <p>{job.job.employmentType}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300">
                  Experience
                </h3>
                <p>
                  {job.job.minExperience}-{job.job.maxExperience} years
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300">
                  Skills Required
                </h3>
                <p>{job.job.skillsRequired}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300">
                  Status
                </h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-bold ${job.job.finalized ? "bg-emerald-500/10 text-emerald-500" : "bg-gray-100 text-gray-400"}`}
                >
                  {job.job.finalized ? "Active" : "Draft"}
                </span>
              </div>
            </div>

            {/* Stats */}
            {/* <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Statistics
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Applicants</p>
                  <p className="text-lg font-bold">{job.totalApplicants}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Posted</p>
                  <p className="text-sm font-bold">{job.posted}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Job ID</p>
                  <p className="text-xs font-bold">{job.job.jobId}</p>
                </div>
              </div>
            </div> */}

            {/* Job Summary */}
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Job Summary
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {job.job.jobSummary}
              </p>
            </div>

            {/* Responsibilities */}
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Responsibilities
              </h3>
              <div className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                {job.job.responsibilities}
              </div>
            </div>

            {/* Qualifications */}
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Qualifications
              </h3>
              <div className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                {job.job.qualifications}
              </div>
            </div>

            {/* Created By */}
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Posted By
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {job.job.createdBy.fullName} ({job.job.createdBy.userType})
              </p>
              <p className="text-sm text-gray-500">{job.job.createdBy.email}</p>
            </div>

            {/* Dates */}
            <div className="border-t pt-4 grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300">
                  Created At
                </h3>
                <p className="text-sm text-gray-500">
                  {new Date(job.job.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300">
                  Updated At
                </h3>
                <p className="text-sm text-gray-500">
                  {new Date(job.job.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobCard;
