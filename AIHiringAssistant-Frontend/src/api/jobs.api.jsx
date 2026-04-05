import api from "./axios";

export const generateJobDescriptionApi = (data) => {
  return api.post("/jobs/ai-generate", data);
};

// endpoint expects a PUT request with jobId query parameter
export const finalizeJobApi = (jobId) => {
  return api.put(`/jobs/finalize`, null, { params: { jobId } });
};

export const getJobsApi = (page = 1) => {
  return api.get("/jobs", { params: { page } });
};

export const getJobByIdApi = (jobId) => {
  return api.get(`/jobs/${jobId}`);
};

export const updateJobApi = (jobId, data) => {
  return api.put(`/jobs/${jobId}`, data);
};

export const deleteJobApi = (jobId) => {
  return api.delete(`/jobs/${jobId}`);
};

export const applyForJobApi = (jobId) => {
  return api.post(`/jobs/apply?jobId=${jobId}`);
};
