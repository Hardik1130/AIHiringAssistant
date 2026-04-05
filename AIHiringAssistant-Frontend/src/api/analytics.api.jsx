import api from "./axios";

export const fetchApplicantFlow = async () => {
  return api.get("/analytics/applicant-flow");
};