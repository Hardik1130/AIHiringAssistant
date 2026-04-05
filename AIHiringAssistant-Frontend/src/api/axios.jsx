import axios from "axios";
import { getToken, removeToken } from "../utils/token";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ---------- REQUEST INTERCEPTOR ----------
const PUBLIC_URLS = ["/auth/login", "/auth/register"];

api.interceptors.request.use(
  (config) => {
    const isPublicApi = PUBLIC_URLS.some((url) => config.url?.includes(url));

    if (!isPublicApi) {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ---------- RESPONSE INTERCEPTOR ----------
api.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;

    // Allow requests to opt-out of the global 401 redirect by setting
    // `skipAuthRedirect` on the request config (e.g. api.post(url, data, { skipAuthRedirect: true }))
    const skip = Boolean(error.config?.skipAuthRedirect || error.config?.headers?.skipAuthRedirect);

    if (status === 401 && !skip) {
      console.warn("Token expired or unauthorized. Logging out...");

      // Show toast to inform user
      try {
        toast.error("Session expired. Please log in again.");
      } catch (e) {
        // ignore if toast not available in this environment
      }

      // Remove token
      removeToken();

      // Redirect to login
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default api;
