import axios from "axios";
import useAuth from "./Store";
import { refreshToken } from "./AuthService";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const accessToken = useAuth.getState().accessToken;

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

let isRefreshing = false;
let refreshFailed = false;

let pending: Array<(token: string | null) => void> = [];

function queueRequest(cb: (token: string | null) => void) {
  pending.push(cb);
}

function resolveQueue(newToken: string | null) {
  pending.forEach((cb) => cb(newToken));
  pending = [];
}

apiClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    console.log("Axios error:", error);

    const isUnauthorized = error.response?.status === 401;
    const original = error.config;

    const requestUrl = original?.url ?? "";

    // Never try to refresh authentication endpoints
    const isAuthRequest =
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/register") ||
      requestUrl.includes("/auth/refresh") ||
      requestUrl.includes("/auth/logout");

    // Only refresh normal protected requests
    if (!isUnauthorized || isAuthRequest || original?._retry || refreshFailed) {
      return Promise.reject(error);
    }

    original._retry = true;

    if (isRefreshing) {
      console.log("Already refreshing...");

      return new Promise((resolve, reject) => {
        queueRequest((newToken) => {
          if (!newToken) {
            reject(error);
            return;
          }

          original.headers.Authorization = `Bearer ${newToken}`;

          resolve(apiClient(original));
        });
      });
    }

    isRefreshing = true;

    try {
      console.log("Start refreshing...");

      const loginResponse = await refreshToken();

      const newToken = loginResponse.accessToken;

      if (!newToken) {
        throw new Error("No access token received!");
      }

      refreshFailed = false;

      useAuth
        .getState()
        .changeLocalLoginData(
          loginResponse.accessToken,
          loginResponse.user,
          true,
        );

      resolveQueue(newToken);

      original.headers.Authorization = `Bearer ${newToken}`;

      return apiClient(original);
    } catch (refreshError) {
      console.log("Refresh token failed:", refreshError);

      refreshFailed = true;

      resolveQueue(null);

      useAuth.getState().logout();

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default apiClient;
