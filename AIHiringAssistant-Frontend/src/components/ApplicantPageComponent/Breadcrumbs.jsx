import React from "react";
import { ChevronRight, Download } from "lucide-react";

const Breadcrumbs = ({
  jobTitle = "Job",
  totalApplicants = 0,
  onDownloadAllResumes,
  isDownloading = false,
}) => {
  return (
    <div className="mb-8">
      <nav
        aria-label="Breadcrumb"
        className="flex text-xs text-brand-gray mb-2 font-medium"
      >
        <ol className="inline-flex items-center space-x-1">
          <li className="inline-flex items-center">
            <a href="#" className="hover:text-brand-orange">
              Jobs
            </a>
          </li>

          <li>
            <div className="flex items-center">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <a href="#" className="ml-1 hover:text-brand-orange">
                {jobTitle}
              </a>
            </div>
          </li>

          <li aria-current="page">
            <div className="flex items-center">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="ml-1 text-brand-dark">Applicants</span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-brand-dark">
            Applicants for {jobTitle}
          </h2>
          <p className="text-brand-gray text-sm mt-1">
            Reviewing {totalApplicants} candidates across multiple stages
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onDownloadAllResumes}
            disabled={isDownloading || !onDownloadAllResumes}
            className={`bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-semibold text-brand-gray hover:bg-gray-50 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed ${
              isDownloading ? "cursor-wait" : ""
            }`}
          >
            <Download className="w-4 h-4" />
            <span>
              {isDownloading ? "Downloading..." : "Download All Resumes"}
            </span>
          </button>

          {/* <button
            className="bg-brand-orange text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-600 
          shadow-md"
          >
            Invite More
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default Breadcrumbs;
