import React from 'react';
import { User, Zap, GraduationCap, Award, Briefcase } from 'lucide-react';

/* =======================
   Professional Summary
======================= */
export const Summary = ({ profile }) => {
  if (!profile) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
        <User className="w-5 h-5 mr-2 text-slate-400" />
        Professional Summary
      </h3>
      <p className="text-slate-600 leading-relaxed">
        {profile.summary}
      </p>
    </div>
  );
};


/* =======================
   Technical Expertise
======================= */
export const TechnicalExpertise = ({ profile }) => {
  if (!profile) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
      <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
        <Zap className="w-5 h-5 mr-2 text-slate-400" />
        Technical Expertise
      </h3>

      <div className="flex flex-wrap gap-3">
        {(profile.skills || []).map((skill, index) => (
          <span
            key={index}
            className="px-4 py-2 bg-slate-100 text-slate-800 rounded-lg text-sm font-semibold border border-slate-200"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
};


/* =======================
   Education & Certifications
======================= */
export const EducationAndCertifications = ({ profile }) => {
  if (!profile) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* Education */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
          <GraduationCap className="w-5 h-5 mr-2 text-slate-400" />
          Education
        </h3>

        {(profile.education || []).map((edu) => (
          <div key={edu.id} className="relative pl-6 border-l-2 border-slate-100 pb-6">
            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#f26522]"></div>
            <h4 className="font-bold text-slate-900">{edu.degree}</h4>
            <p className="text-slate-500 text-sm mt-1">{edu.institution}</p>
            <p className="text-xs text-slate-400 mt-1">{edu.period}</p>
          </div>
        ))}
      </div>

      {/* Certifications */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
          <Award className="w-5 h-5 mr-2 text-slate-400" />
          Certifications
        </h3>

        {(profile.certifications || []).map((cert) => (
          <div key={cert.id} className="relative pl-6 border-l-2 border-slate-100 pb-6">
            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#f26522]"></div>
            <h4 className="font-bold text-slate-900">{cert.name}</h4>
            <p className="text-slate-500 text-sm mt-1">{cert.issuer}</p>
            <p className="text-xs text-slate-400 mt-1">{cert.date}</p>
          </div>
        ))}
      </div>

    </div>
  );
};


/* =======================
   Experience Section
======================= */
export const ExperienceSection = ({ profile }) => {
  if (!profile) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
      <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
        <Briefcase className="w-5 h-5 mr-2 text-slate-400" />
        Experience
      </h3>

      <div className="space-y-10">
        {(profile.experience || []).map((exp) => (
          <div key={exp.id} className="relative pl-8 border-l-2 border-slate-100">
            <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-slate-200"></div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-lg">
                  {exp.title}
                </h4>
                <p className="text-[#f26522] font-medium">
                  {exp.company}
                </p>
              </div>

              <div className="text-sm text-slate-500 mt-1 md:mt-0 bg-slate-50 px-3 py-1 rounded-full border border-slate-200 font-medium">
                {exp.period}
              </div>
            </div>

            <ul className="mt-4 space-y-2 text-slate-600 text-sm list-disc pl-4">
              {(exp.description || []).map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

    </div>
  );
};