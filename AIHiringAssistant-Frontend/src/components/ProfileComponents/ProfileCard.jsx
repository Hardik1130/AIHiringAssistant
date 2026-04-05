import React from "react";
import { MapPin, Edit2, CheckCircle } from "lucide-react";

/* =======================
   Profile Card Component
======================= */
export const ProfileCard = ({ profile, onEdit }) => {

  console.log("Rendering ProfileCard with profile:", profile);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 overflow-hidden relative">
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#f26522]"></div>

      <div className="flex flex-col items-center text-center mt-4">
        <div className="relative">
          <img
            src={profile?.avatar}
            alt={profile?.name}
            className="w-32 h-32 rounded-full object-cover ring-4 ring-slate-50 shadow-lg"
          />
          <span
            className="absolute bottom-2 right-2 block h-5 w-5 rounded-full bg-green-500 ring-4 ring-white"
            title="Active now"
          ></span>
        </div>

        <h2 className="mt-5 text-2xl font-bold text-slate-900">
          {profile?.name}
        </h2>

        <button
          onClick={onEdit}
          className="mt-1 flex items-center text-xs text-slate-400 hover:text-[#f26522] transition-colors group"
        >
          <Edit2 className="w-3 h-3 mr-1" />
          Edit Profile
        </button>

        <p className="text-[#f26522] font-semibold mt-1">
          {profile?.role}
          {profile?.highestEducation && (
            <span className="block text-xs text-slate-500 font-normal mt-1">
              {profile.highestEducation}
            </span>
          )}
        </p>

        <div className="mt-2 flex items-center text-slate-500 text-sm">
          <MapPin className="w-4 h-4 mr-1" />
          {profile?.location}
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100 space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-500">Total Experience</span>
          <span className="font-bold text-slate-900">
            {profile?.totalExperience != null && profile?.totalExperience !== ""
              ? `${profile.totalExperience} years`
              : ""}
          </span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-500">Availability</span>
          <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded">
            {profile?.availability}
          </span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-500">Expected CTC</span>
          <span className="font-bold text-slate-900">
            {profile?.expectedCTC && `₹ ${profile.expectedCTC}`}
          </span>
        </div>
      </div>

      <div className="mt-8 flex space-x-2">
        <button className="flex-1 py-2.5 px-4 bg-slate-100 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors">
          Message
        </button>

        <button className="flex-1 py-2.5 px-4 bg-[#f26522] text-white rounded-lg text-sm font-bold hover:bg-orange-600 transition-colors">
          Shortlist
        </button>
      </div>
    </div>
  );
};

/* =======================
   AI Insights Component
======================= */
export const AIInsights = ({ profile }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-900">AI Insights</h3>
        <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
          AI DRIVEN
        </span>
      </div>

      {/* Circular Progress */}
      <div className="flex items-center justify-center py-6">
        <div className="relative w-24 h-24">
          <svg className="w-full h-full" viewBox="0 0 36 36">
            <path
              className="text-slate-100"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className="text-[#f26522]"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeDasharray={`${profile?.matchPercentage || 0}, 100`}
              strokeLinecap="round"
              strokeWidth="3"
            />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-extrabold text-slate-900">
              {profile?.matchPercentage || 0}%
            </span>
          </div>
        </div>
      </div>

      <p className="text-sm text-center text-slate-600 mb-4 px-2">
        Strong match for "{profile?.role}" roles based on skill overlap and
        career trajectory.
      </p>

      <ul className="space-y-2 text-xs">
        {(profile?.aiInsights || []).map((insight, idx) => (
          <li key={idx} className="flex items-start text-slate-600">
            <CheckCircle className="w-4 h-4 text-green-500 mr-2 shrink-0" />
            {insight}
          </li>
        ))}
      </ul>
    </div>
  );
};
