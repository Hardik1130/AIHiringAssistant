import api from "./axios";

export const fetchDashboardData = async () => {
  return api.get("/users/dashboard");
};
