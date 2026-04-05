import React, { useState } from "react";
import {
  Sparkles,
  MapPin,
  Clock,
  LayoutGrid,
  GraduationCap,
  Zap,
} from "lucide-react";

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

const ApplicantCard = ({ applicant }) => {
  const [showAllSkills, setShowAllSkills] = useState(false);
  const name = applicant.fullname;
  const role = applicant.currentRole;
  const location = applicant.location || "N/A";
  const experience = `${applicant.totalExperience} Years Experience`;
  const fitScore = applicant.aiScore;
  const skills = safeParseSkills(applicant.topSkills);
  const education = applicant.education;
  const stage = "New";
  const stageColor = "green";
  const image = "https://via.placeholder.com/80";
  const highlight = "";
  const matchedBy = [];
  const isGrayscale = false;
  const avatarUrl = applicant.avatar || image;
  const email = applicant.email;

  const handleViewProfile = () => {
    window.open(`/profile?userId=${applicant.userId}`, "_blank");
  };

  const handleQuickContact = () => {
    if (!email) {
      window.alert("Email address is not available for this candidate.");
      return;
    }

    const subject = "Quick contact from AI Hire";
    const body = "Hello,%0A%0AI would like to contact you regarding your application.";
    const encodedEmail = encodeURIComponent(email);

    // Gmail compose URL
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedEmail}&su=${encodeURIComponent(subject)}&body=${body}`;

    // Fallback mailto
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${body}`;
    try {
      window.open(gmailUrl, "_blank");
    } catch (e) {
      window.open(mailtoUrl, "_blank");
    }
  };

  const stageColors = {
    blue: "bg-blue-50 text-blue-600",
    gray: "bg-gray-100 text-gray-600",
    green: "bg-green-50 text-green-600",
  };

  const badgeColors = {
    96: "bg-brand-orange",
    88: "bg-brand-orange/80",
    72: "bg-brand-orange/60",
  };

  return (
    <article className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
      {/* AI Score Badge */}
      <div className="absolute top-0 right-0">
        <div
          className={`${badgeColors[fitScore] || "bg-brand-orange"} text-white px-4 py-1.5 rounded-bl-2xl font-bold flex items-center space-x-1.5`}
        >
          {fitScore >= 90 && <Sparkles className="w-4 h-4" />}
          <span>{fitScore}% Fit</span>
        </div>
      </div>

      <div
        className={`flex flex-col md:flex-row items-start gap-6 ${isGrayscale ? "opacity-90 grayscale-[0.2]" : ""}`}
      >
        {/* Candidate Basics */}
        <div className="flex-shrink-0 flex flex-col items-center">
          <img
            src={avatarUrl}
            alt={name}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-brand-lightOrange"
            referrerPolicy="no-referrer"
          />
          <div className="mt-4 text-center">
            <span
              className={`text-[10px] ${stageColors[stageColor] || ""} px-2 py-1 rounded-full font-bold uppercase`}
            >
              {stage}
            </span>
          </div>
        </div>

        <div className="flex-grow w-full">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="text-xl font-bold">
                {name}{" "}
                <span className="text-brand-gray font-medium text-sm ml-2 block sm:inline mt-1 sm:mt-0">
                  {role}
                </span>
              </h4>
              <div className="flex flex-wrap items-center text-sm text-brand-gray mt-1 gap-4">
                <span className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1 text-gray-400" /> {location}
                </span>
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1 text-gray-400" /> {experience}
                </span>
              </div>
            </div>
          </div>

          {/* AI Insights Section */}
          <div className="bg-gray-50 rounded-xl p-4 mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center space-x-1 mb-2">
                <LayoutGrid className="w-3.5 h-3.5 text-brand-orange" />
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  Top Skills
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {skills.slice(0, 3).map((skill) => (
                  <span
                    key={skill}
                    className="text-xs bg-white border border-gray-200 px-2 py-0.5 rounded text-brand-dark font-medium"
                  >
                    {skill}
                  </span>
                ))}
                {skills.length > 3 && (
                  <button
                    type="button"
                    onClick={() => setShowAllSkills(true)}
                    className="text-xs font-semibold text-brand-orange underline ml-1"
                  >
                    Read more
                  </button>
                )}
              </div>

              {showAllSkills && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                  <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 relative">
                    <button
                      type="button"
                      onClick={() => setShowAllSkills(false)}
                      className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                      aria-label="Close"
                    >
                      ×
                    </button>
                    <h3 className="text-lg font-bold mb-4">All Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <span
                          key={skill}
                          className="text-xs bg-gray-50 border border-gray-200 px-2 py-0.5 rounded text-brand-dark font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center space-x-1 mb-2">
                <GraduationCap className="w-3.5 h-3.5 text-brand-orange" />
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  Education
                </span>
              </div>
              <p className="text-xs font-semibold text-brand-dark">
                {education || "N/A"}
              </p>
            </div>
            <div>
              <div className="flex items-center space-x-1 mb-2">
                <Zap className="w-3.5 h-3.5 text-brand-orange" />
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  Matched by
                </span>
              </div>
              <p className="text-xs font-semibold text-brand-dark">
                {fitScore}% Fit
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center">
              <span className="text-[11px] text-gray-400 font-bold uppercase mr-4">
                Matched by
              </span>
              <div className="flex -space-x-2">
                {matchedBy.map((match, i) =>
                  match.type === "image" ? (
                    <img
                      key={i}
                      src={match.src}
                      className="w-6 h-6 rounded-full ring-2 ring-white object-cover"
                      alt="Matcher"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full bg-gray-100 ring-2 ring-white flex items-center justify-center text-[10px] font-bold text-gray-600"
                    >
                      {match.text}
                    </div>
                  ),
                )}
              </div>
            </div>
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <button
                onClick={handleViewProfile}
                className="flex-1 sm:flex-none text-brand-gray text-sm font-semibold px-4 py-2 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-200 transition-colors"
              >
                View Profile
              </button>
              <button
                onClick={handleQuickContact}
                className="flex-1 sm:flex-none bg-brand-orange bg-orange-500 text-white px-6 py-2 rounded-lg text-sm font-bold shadow hover:bg-orange-700 transition-colors"
              >
                Quick Contact
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ApplicantCard;
