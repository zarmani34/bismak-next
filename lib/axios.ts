import axios from "axios";

/**
 * Base axios instance pointing at our Django backend.
 *
 * withCredentials: true — this is the key setting for Option 2.
 * It tells the browser to automatically send cookies (including the
 * httpOnly access token cookie set by dj-rest-auth) with every request.
 * You don't need to manually attach any token — the browser handles it.
 */
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

/**
 * RESPONSE INTERCEPTOR
 * If Django returns 401 (access token expired), silently call the
 * refresh endpoint. The browser automatically sends the refresh cookie.
 * Django sets a new access token cookie and we retry the request.
 *
 * If refresh fails → redirect to login.
 */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/token/refresh/`,
          {},
          { withCredentials: true },
        );
        return api(originalRequest); // retry original request
      } catch {
        if (typeof window !== "undefined") {
          window.location.href = "/portal/sign-in";
        }
      }
    }

    return Promise.reject(error);
  },
);

export default api;
