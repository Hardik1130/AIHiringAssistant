import api from "./axios";

export const getProfileApi = () => {
  return api.get("/profile");
};

export const uploadResumeApi = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.post("/candidates/upload-resume", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const downloadResumeApi = () => {
  return api.get("/candidates/download-resume");
};

// update profile endpoint used by edit modal
export const updateProfileApi = (data) => {
  // frontend sends an object containing totalExperience, currentRole, availability, expectedCTC, summary, etc.
  return api.post("/profile", data);
};

// fetch paged users list
export const getUsersApi = (page = 1) => {
  // backend expects ?page=<pageNumber>
  return api.get(`/users?page=${page}`);
};

// fetch specific user profile
export const getUserSpecificProfileApi = (userId) => {
  // backend expects ?userId=<userId>
  return api.get(`/profile?userId=${userId}`);
};
