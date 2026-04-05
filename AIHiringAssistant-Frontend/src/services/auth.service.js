import { loginApi, registerApi } from "../api/auth.api";
import { setToken, removeToken } from "../utils/token";

const authService = {
  /**
   * Log in a user with credentials.
   * @param {Object} credentials - The login data (email, password).
   * @returns {Promise<Object>} The response data containing user and token.
   */
  async login(credentials) {
    try {
      const response = await loginApi(credentials);
      console.log("Login response:", response.data);
      const data = response.data || {};
      const token = data.token || data?.data?.token;
      console.log("Extracted token:", token);
      const user =
        data.user ||
        data?.data?.user ||
        data.userEntity ||
        data?.data?.userEntity ||
        null;
      if (token) {
        const accessToken =
          typeof token === "string" ? token : token?.accessToken;
        if (accessToken) {
          setToken(accessToken);
          console.log("Stored accessToken in localStorage");
        }
      }
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }
      return { ...data, token, user };
    } catch (error) {
      throw error.response?.data?.message || "Login failed";
    }
  },

  /**
   * Register a new user.
   * @param {Object} userData - The registration data.
   * @returns {Promise<Object>} The response data.
   */
  async register(userData) {
    try {
      const response = await registerApi(userData);
      const data = response.data || {};
      const token = data.token || data?.data?.token;
      const user =
        data.user ||
        data?.data?.user ||
        data.userEntity ||
        data?.data?.userEntity ||
        null;

      if (token) {
        const accessToken =
          typeof token === "string" ? token : token?.accessToken;
        if (accessToken) {
          setToken(accessToken);
        }
      }

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }

      return { ...data, token, user };
    } catch (error) {
      throw error.response?.data?.message || "Registration failed";
    }
  },

  /**
   * Log out the current user.
   */
  logout() {
    removeToken();
  },

  /**
   * Fetch the profile of the currently authenticated user.
   * Useful for refreshing user data after login or on app boot.
   */
  async fetchProfile() {
    try {
      const { data } = await import("../api/user.api").then((m) =>
        m.getProfileApi(),
      );
      // store if needed
      // if (data?.user) {
      //   localStorage.setItem("user", JSON.stringify(data.user));
      // }
      return data;
    } catch (error) {
      throw error.response?.data?.message || "Unable to fetch profile";
    }
  },

  /**
   * Get the current user from localStorage if available.
   */
  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },
};

export default authService;
