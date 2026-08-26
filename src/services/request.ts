import axios, { type AxiosError, type AxiosRequestConfig } from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5080";

const AUTH_ENDPOINTS_WITHOUT_SESSION = ["/auth/login", "/auth/refresh"];

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
  | { res: false; message: string; status?: number };

type RefreshResponse = {
  accessToken: string;
  refreshToken: string;
};

let pendingRefresh: Promise<boolean> | null = null;

const performRefresh = async (): Promise<boolean> => {
  const storedRefreshToken = localStorage.getItem("refreshToken");

  if (!storedRefreshToken) {
    return false;
  }

  try {
    const response = await api.post<RefreshResponse>("/auth/refresh", {
      refreshToken: storedRefreshToken,
    });

    localStorage.setItem("token", response.data.accessToken);
    localStorage.setItem("refreshToken", response.data.refreshToken);
    return true;
  } catch {
    return false;
  }
};

const refreshAccessToken = (): Promise<boolean> => {
  if (!pendingRefresh) {
    pendingRefresh = performRefresh().finally(() => {
      pendingRefresh = null;
    });
  }

  return pendingRefresh;
};

const endSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");

  if (window.location.pathname !== "/giris") {
    window.location.assign("/giris");
  }
};

export const request = async <T = unknown>(
  url: string,
  method: AxiosRequestConfig["method"],
  data: unknown = null,
  contentType: string = "application/json",
  isRetryAfterRefresh: boolean = false
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
    const error = err as AxiosError<unknown>;
    const status = error.response?.status;
    const isSessionEndpoint = AUTH_ENDPOINTS_WITHOUT_SESSION.includes(url);

    if (status === 401 && !isSessionEndpoint) {
      if (!isRetryAfterRefresh) {
        const refreshed = await refreshAccessToken();

        if (refreshed) {
          return request<T>(url, method, data, contentType, true);
        }
      }

      endSession();
    }

    console.error("API Request Error:", error);

    const body = error.response?.data;
    const message =
      typeof body === "string" && body.trim().length > 0
        ? body
        : error.message;

    return { res: false, message, status };
  }
};

export default api;
