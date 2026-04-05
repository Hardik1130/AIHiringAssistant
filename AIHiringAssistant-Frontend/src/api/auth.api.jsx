import api from './axios';

export const loginApi = (data) => {
  // mark this request to skip the global 401 redirect so login failures
  // can be handled locally (e.g. show toast and clear form) without
  // the app forcing a reload/redirect to /login
  return api.post('/auth/login', data, { skipAuthRedirect: true });
};

export const registerApi = (data) => {
  // Skip the global 401 redirect for registration so the UI can handle
  // validation errors locally (e.g. show toast) instead of forcing a reload.
  return api.post('/auth/register', data, { skipAuthRedirect: true });
};
