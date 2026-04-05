import React, { useState, useEffect } from "react";
import { Upload, Download, Calendar } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "react-toastify";
import Loader from "../Loader/Loader";
import { ProfileCard } from "../ProfileComponents/ProfileCard";
import { AIInsights } from "../ProfileComponents/ProfileCard";
import {
  Summary,
  TechnicalExpertise,
  EducationAndCertifications,
  ExperienceSection,
} from "../ProfileComponents/MainContent";
import { EditProfileModal } from "../ProfileComponents/EditProfileModal";
// Fallback sample data is no longer used - profile will come from the backend
import {
  uploadResumeApi,
  downloadResumeApi,
  getUserSpecificProfileApi,
} from "../../api/user.api";
import { useAuth } from "../../context/AuthContext";

export default function CandidateProfilePage() {
  const { user: profile, updateProfile, fetchProfile } = useAuth();
  const [candidateProfile, setCandidateProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSpecificUser, setIsSpecificUser] = useState(false);

  // Get userId from query params
  const searchParams = new URLSearchParams(window.location.search);
  const userIdFromQuery = searchParams.get("userId");

  // Determine which profile to display
  const displayProfile = isSpecificUser ? candidateProfile : profile;
  const hasProfile = displayProfile && displayProfile.resumeUrl;
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCVUploaded, setIsCVUploaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const fileInputRef = React.useRef(null);

  // load real profile on mount if missing
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      if (userIdFromQuery) {
        // Load specific user's profile
        setIsSpecificUser(true);
        getUserSpecificProfileApi(userIdFromQuery)
          .then((res) => {
            if (res.data.error === false) {
              setCandidateProfile(res.data.data);
              // toast.success(res.data.message || "Profile loaded successfully");
            } else {
              toast.error(res.data.message || "Failed to load profile");
            }
          })
          .catch((err) => {
            console.error("Error fetching candidate profile:", err);
            toast.error("Failed to load candidate profile");
          })
          .finally(() => setLoading(false));
      } else {
        // Load current user's profile
        setIsSpecificUser(false);
        if (!profile) {
          fetchProfile().catch((e) =>
            console.error("Error fetching profile", e),
          );
        }
        setLoading(false);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [userIdFromQuery, profile, fetchProfile]);

  const handleSaveProfile = (updatedData) => {
    updateProfile(updatedData);
    setIsCVUploaded(true);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type (PDF, DOC, DOCX)
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid resume file (PDF, DOC, or DOCX)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    setIsUploadingResume(true);
    try {
      const response = await uploadResumeApi(file);
      const payload = response.data || {};
      // backend might wrap parsed profile under "data"
      const parsed = payload.data || payload;

      // update resumeUrl if present (not strictly needed - stored in profile)
      if (parsed.resumeUrl) {
        // optionally keep for local reference
      }

      // merge parsed fields into profile context state
      if (parsed && typeof parsed === "object") {
        updateProfile(parsed);
      }

      setIsCVUploaded(true);
      // toast.success(payload.message || "Resume uploaded successfully");
      // update global auth user as well so header/profile link shows fresh data
      if (typeof refreshUser === "function") {
        refreshUser().catch(() => {});
      }
    } catch (error) {
      console.error("Error uploading resume:", error);
      toast.error(error.response?.data?.message || "Failed to upload resume");
    } finally {
      setIsUploadingResume(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleExportCV = async () => {
    setIsDownloading(true);
    try {
      let fileUrl;
      if (isSpecificUser) {
        // For specific user, get resumeUrl from candidateProfile
        fileUrl = candidateProfile?.resumeUrl;
      } else {
        // For current user, use the API
        const res = await downloadResumeApi();
        fileUrl = res?.data?.data || res?.data;
      }

      if (!fileUrl) {
        toast.error("No resume available for download");
        return;
      }

      const fetchRes = await fetch(fileUrl);
      if (!fetchRes.ok) throw new Error("Failed to fetch resume file");

      // Convert blob to PDF format
      const blob = await fetchRes.blob();
      const pdfBlob = new Blob([blob], { type: "application/pdf" });
      const objectUrl = window.URL.createObjectURL(pdfBlob);

      // Extract filename and ensure it ends with .pdf
      const parts = fileUrl.split("/");
      let filename = decodeURIComponent(parts[parts.length - 1] || "resume");

      // Remove any existing extension and add .pdf
      filename = filename.replace(/\.[a-zA-Z0-9]+$/, "") + ".pdf";

      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(objectUrl);

      toast.success("Resume downloaded successfully");
    } catch (error) {
      console.error("Error downloading resume:", error);
      toast.error(
        error?.response?.data?.message || "Failed to download resume",
      );
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {loading && <Loader />}

      {!loading && (
        <>
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumbs & Page Header */}
            <div className="mb-8">
              <nav className="flex text-sm text-slate-500 mb-2">
                <a href="#" className="hover:text-[#f26522] transition-colors">
                  Candidates
                </a>
                <span className="mx-2">/</span>
                <span className="text-slate-900 font-medium">
                  {displayProfile?.name}
                </span>
              </nav>

              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                  <h1 className="text-3xl font-extrabold text-slate-900">
                    Candidate Profile
                  </h1>
                  <p className="text-slate-500 mt-1">
                    Review professional details and AI match analysis.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleExportCV}
                    disabled={isDownloading || !hasProfile}
                    className={`px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold flex items-center transition-all ${
                      isDownloading || !hasProfile
                        ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                        : "bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {isDownloading ? "Downloading..." : "Export CV"}
                  </button>

                  <button
                    onClick={handleUploadClick}
                    disabled={isUploadingResume || isSpecificUser}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center transition-all ${
                      isUploadingResume || isSpecificUser
                        ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                        : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {isUploadingResume ? "Uploading..." : "Upload CV"}
                  </button>

                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />

                  {/* <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-black flex items-center transition-colors">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Interview
                  </button> */}
                </div>
              </div>
            </div>

            {/* Main Grid Layout */}
            {!hasProfile && (
              <div className="text-center py-12">
                <p className="text-slate-600 mb-4">
                  {isSpecificUser
                    ? "This candidate has not uploaded a profile yet."
                    : "Your profile will appear here once you upload a CV."}
                </p>
                {/* the upload button above remains accessible */}
              </div>
            )}

            {hasProfile && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <motion.section
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="lg:col-span-1 space-y-6"
                >
                  <ProfileCard
                    profile={displayProfile}
                    onEdit={() => !isSpecificUser && setIsEditModalOpen(true)}
                  />
                  <AIInsights profile={displayProfile} />
                </motion.section>

                {/* Right Column */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="lg:col-span-2 space-y-6"
                >
                  <Summary profile={displayProfile} />
                  <TechnicalExpertise profile={displayProfile} />
                  <EducationAndCertifications profile={displayProfile} />
                  <ExperienceSection profile={displayProfile} />
                </motion.section>
              </div>
            )}
          </main>

          <EditProfileModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            profile={profile}
            onSave={handleSaveProfile}
          />
        </>
      )}
    </div>
  );
}
