import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    Expires: "0",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("Request headers:", config.headers);
    console.log("Request URL:", config.url);
    console.log("Request method:", config.method);
    console.log("Request data:", config.data);
  } else {
    console.warn("No token found in localStorage");
  }
  // Add timestamp to prevent caching
  if (config.method === "get") {
    config.params = {
      ...config.params,
      _t: Date.now(),
    };
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log("Response status:", response.status);
    console.log("Response data:", response.data);
    return response;
  },
  (error) => {
    console.error("API Error:", {
      status: error.response?.status,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers,
        data: error.config?.data,
      },
    });

    if (error.response?.status === 401) {
      console.error("Authentication failed - clearing token");
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);
