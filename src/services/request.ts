import axios, { type AxiosError, type AxiosRequestConfig } from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000/v1/";

const api = axios.create({
  baseURL: API_BASE,
  maxBodyLength: Infinity,
  maxContentLength: Infinity,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export type ApiResult<T = unknown> =
  | { res: true; data: T }
  | { res: false; message: string; code?: string | number };

// Genel amaçlı request fonksiyonu - TrackSem'deki services/request.js ile aynı desen
export const request = async <T = unknown>(
  url: string,
  method: AxiosRequestConfig["method"],
  data: unknown = null,
  contentType: string = "application/json"
): Promise<ApiResult<T>> => {
  try {
    const config: AxiosRequestConfig = { url, method, headers: {} };

    if (contentType && contentType !== "application/json") {
      config.headers = { ...config.headers, "Content-Type": contentType };
    }

    if (data) {
      config.data =
        contentType === "multipart/form-data" ? data : JSON.stringify(data);
    }

    const response = await api.request<T>(config);
    return { res: true, data: response.data };
  } catch (err) {
    const error = err as AxiosError<{ code?: string; message?: string }>;
    console.error("API Request Error:", error);

    if (error.response?.data?.code === "TOKEN_EXPIRED") {
      localStorage.removeItem("token");
      window.location.href = "/login";
      return { res: false, message: "Session expired", code: "AUTH_ERROR" };
    }

    const message = error.response?.data?.message || error.message;
    return { res: false, message, code: error.response?.status };
  }
};

export default api;
