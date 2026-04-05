import api from "./axios";

/**
 * Fetch applicants for a job with optional filtering.
 *
 * @param {object} payload - Request payload.
 * @param {string} payload.jobId - Job id (required)
 * @param {string[]} [payload.scoreRanges] - e.g. ['Low (< 70%)']
 * @param {string[]} [payload.topSkills] - e.g. ['ReactJS']
 * @param {number} [payload.experience] - number of years
 * @param {string} [payload.educationLevel] - e.g. 'Bachelor of Technology'
 */
export const getApplicantsApi = (payload) => {
  return api.post("/applicants", payload);
};
