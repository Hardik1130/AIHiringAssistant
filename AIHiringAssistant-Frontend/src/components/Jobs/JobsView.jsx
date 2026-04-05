import React, { useState, useEffect } from "react";
import JobCard from "./JobCard";
import Loader from "../Loader/Loader";
import { getJobsApi } from "../../api/jobs.api";
import { useSearch } from "../../context/SearchContext";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const JobsView = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { searchQuery } = useSearch();
  const { setHasJobsPostedToday } = useAuth();

  useEffect(() => {
    const loadJob = async () => {
      try {
        setLoading(true);
        const response = await getJobsApi(currentPage);
        if (response.data.error === false) {
          const jobsList = response.data.data.jobs;
          setJobs(jobsList);
          setTotalPages(response.data.data.totalPages);

          // Check if any job was created today
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const todayStart = today.getTime();

          const jobsPostedToday = jobsList.some((jobWrapper) => {
            const job = jobWrapper.job;
            const createdDate = new Date(job?.createdAt);
            return createdDate.getTime() >= todayStart;
          });

          setHasJobsPostedToday(jobsPostedToday);
        } else {
          setError("Failed to fetch jobs");
          toast.error(response.data.message || "Failed to fetch jobs");
          setHasJobsPostedToday(false);
        }
      } catch (err) {
        setError("Failed to fetch jobs");
        toast.error("Failed to fetch jobs");
        console.error(err);
        setHasJobsPostedToday(false);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      }
    };
    loadJob();
  }, [currentPage, setHasJobsPostedToday]);

  // Filter jobs based on search query
  const filteredJobs = jobs.filter((jobWrapper) => {
    const job = jobWrapper.job;
    const searchLower = searchQuery.toLowerCase();

    return (
      (job.title && job.title.toLowerCase().includes(searchLower)) ||
      (job.location && job.location.toLowerCase().includes(searchLower)) ||
      (job.jobCategory &&
        job.jobCategory.toLowerCase().includes(searchLower)) ||
      (job.description && job.description.toLowerCase().includes(searchLower))
    );
  });

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        {error}
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Active Jobs</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage your pipeline and published listings.
          </p>
        </div>

        {/* <button
          className="w-full sm:w-auto flex items-center justify-center gap-2 text-white px-3 py-2 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
          style={{ backgroundColor: "#ec5b13" }}
        >
          <span className="material-symbols-outlined">add_circle</span>
          Create Job
        </button> */}
      </div>

      {/* Filters */}
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {["All Jobs"].map((filter, index) => (
          <button
            key={filter}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
              index === 0
                ? "bg-[#ec5b13] text-white"
                : "bg-white dark:bg-white/5 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-white/10 hover:border-primary/50"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Job Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => <JobCard key={job.job.id} job={job} />)
        ) : (
          <div className="col-span-full flex justify-center items-center h-64 text-gray-500">
            <div className="text-center">
              <span className="material-symbols-outlined text-5xl mb-2 block">
                search_off
              </span>
              <p>No jobs found matching "{searchQuery}"</p>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-white/20 transition-all"
          >
            Previous
          </button>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-white/20 transition-all"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default JobsView;
