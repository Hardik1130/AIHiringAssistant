export const View = {
  LOGIN: "LOGIN",
  REGISTER: "REGISTER",
  DASHBOARD: "DASHBOARD",
};

// =============================
// Experience Structure
// =============================
export const Experience = {
  id: "",
  title: "",
  company: "",
  period: "",
  description: [], // array of strings
};

// =============================
// Education Structure
// =============================
export const Education = {
  id: "",
  degree: "",
  institution: "",
  period: "",
};

// =============================
// Certification Structure
// =============================
export const Certification = {
  id: "",
  name: "",
  issuer: "",
  date: "",
};

// =============================
// Candidate Profile Structure
// =============================
export const CandidateProfile = {
  name: "",
  role: "",
  location: "",
  avatar: "",
  totalExperience: 0, // number of whole years
  availability: "",
  expectedCTC: "",
  summary: "",
  skills: [], // array of strings
  education: [], // array of Education
  certifications: [], // array of Certification
  experience: [], // array of Experience
  matchPercentage: 0,
  aiInsights: [], // array of strings
  highestEducation: "", // highest degree or qualification
};
