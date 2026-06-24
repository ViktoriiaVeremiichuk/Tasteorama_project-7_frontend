import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

const REQUEST_TIMEOUT_MS = 10_000;

export const api = axios.create({
  withCredentials: true,
  timeout: REQUEST_TIMEOUT_MS,
});

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

let refreshPromise: Promise<void> | null = null;

const shouldAttemptRefresh = (error: AxiosError, config?: RetryableRequestConfig) => {
  if (!config || config._retry) {
    return false;
  }

  const requestUrl = config.url ?? "";

  return (
    error.response?.status === 401 &&
    !requestUrl.includes("/api/auth/refresh") &&
    !requestUrl.includes("/api/auth/login") &&
    !requestUrl.includes("/api/auth/register")
  );
};

const rebuildRequestData = (data: unknown) => {
  if (typeof FormData !== "undefined" && data instanceof FormData) {
    const clone = new FormData();
    data.forEach((value, key) => {
      clone.append(key, value);
    });
    return clone;
  }

  return data;
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetryableRequestConfig | undefined;

    if (!error.response) {
      return Promise.reject(error);
    }

    if (!shouldAttemptRefresh(error, config) || !config) {
      return Promise.reject(error);
    }

    config._retry = true;

    if (!refreshPromise) {
      refreshPromise = api
        .post("/api/auth/refresh")
        .then(() => {
          refreshPromise = null;
        })
        .catch((refreshError) => {
          refreshPromise = null;
          return Promise.reject(refreshError);
        });
    }

    await refreshPromise;

    config.data = rebuildRequestData(config.data);

    return api(config);
  }
);
