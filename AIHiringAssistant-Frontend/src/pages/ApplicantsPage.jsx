import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import JSZip from "jszip";
import Breadcrumbs from "../components/ApplicantPageComponent/Breadcrumbs";
import Sidebar from "../components/ApplicantPageComponent/Sidebar";
import ApplicantCard from "../components/ApplicantPageComponent/ApplicantCard";
import FloatingChat from "../components/ApplicantPageComponent/FloatingChat";
import Loader from "../components/Loader/Loader";
import NotFound from "../components/NotFound/NotFound";
import { getApplicantsApi } from "../api/filter.api";

const defaultFilters = {
  scoreRanges: [],
  topSkills: [],
  experience: null,
  educationLevel: "",
};

function safeParseSkills(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    return JSON.parse(value);
  } catch {
    return value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
}

const ApplicantsPage = () => {
  const [applicants, setApplicants] = useState([]);
  const [jobTitle, setJobTitle] = useState("");
  const [totalApplicants, setTotalApplicants] = useState(0);
  const [filters, setFilters] = useState(defaultFilters);
  const [loading, setLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const location = useLocation();
  const jobId = location.state?.jobId;

  const fetchApplicants = async (currentFilters = filters) => {
    if (!jobId) {
      toast.error("Job ID not found");
      return;
    }
    setLoading(true);
    const startTime = Date.now();
    try {
      const payload = { jobId, ...currentFilters };
      // Remove null/empty values
      Object.keys(payload).forEach((key) => {
        if (
          payload[key] === null ||
          payload[key] === "" ||
          (Array.isArray(payload[key]) && payload[key].length === 0)
        ) {
          delete payload[key];
        }
      });
      const response = await getApplicantsApi(payload);
      if (response.data.error === false) {
        const data = response.data.data || {};
        setApplicants(data.applicants || []);
        setJobTitle(data.jobDetails?.title || "");
        setTotalApplicants(
          data.totalApplicants ?? data.applicants?.length ?? 0,
        );
      } else {
        toast.error(response.data.message || "Failed to fetch applicants");
      }
    } catch (error) {
      toast.error("Error fetching applicants");
    } finally {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 2000 - elapsed);
      setTimeout(() => setLoading(false), remaining);
    }
  };

  const handleDownloadAllResumes = async () => {
    if (!applicants.length) {
      toast.info("No applicants to download resumes for");
      return;
    }

    const records = applicants.filter((item) => item.resumeUrl);
    if (!records.length) {
      toast.warn("No resume URLs found for applicants");
      return;
    }

    setIsDownloading(true);

    try {
      const zip = new JSZip();

      for (const applicant of records) {
        const resumeUrl = applicant.resumeUrl;
        if (!resumeUrl) continue;

        const response = await fetch(resumeUrl);
        if (!response.ok) {
          toast.warn(`Failed to fetch resume for ${applicant.fullname}`);
          continue;
        }

        const blob = await response.blob();

        const urlPath = resumeUrl.split("?")[0].split("/");
        const rawName =
          urlPath[urlPath.length - 1] || `${applicant.fullname || "resume"}`;
        let filename = decodeURIComponent(rawName);
        filename = filename.replace(/\.[a-zA-Z0-9]+$/, "") + ".pdf";
        filename = filename.replace(/[\s]+/g, "_");

        zip.file(filename, blob);
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const zipUrl = window.URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = zipUrl;
      a.download = `${jobTitle ? jobTitle.replace(/[\s]+/g, "_") : "applicants"}_resumes.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(zipUrl);

      toast.success("All available resumes downloaded as a single ZIP");
    } catch (error) {
      console.error("Error downloading resumes:", error);
      toast.error("Failed to download resumes");
    } finally {
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  const handleSearch = () => {
    fetchApplicants();
  };

  const handleClear = () => {
    setFilters(defaultFilters);
    fetchApplicants(defaultFilters);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8">
      <Breadcrumbs
        jobTitle={jobTitle}
        totalApplicants={totalApplicants}
        onDownloadAllResumes={handleDownloadAllResumes}
        isDownloading={isDownloading}
      />

      <div className="flex flex-col lg:flex-row gap-8">
        <Sidebar
          filters={filters}
          onFilterChange={setFilters}
          onSearch={handleSearch}
          onClear={handleClear}
        />

        <section className="flex-grow space-y-6">
          {loading ? (
            <Loader />
          ) : applicants.length === 0 ? (
            <NotFound onClear={handleClear} />
          ) : (
            applicants.map((applicant) => (
              <ApplicantCard
                key={applicant.applicationId}
                applicant={applicant}
              />
            ))
          )}
        </section>
      </div>

      {/* <Pagination /> */}
      <FloatingChat />
    </div>
  );
};

export default ApplicantsPage;
