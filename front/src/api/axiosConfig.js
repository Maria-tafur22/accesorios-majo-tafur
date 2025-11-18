import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACK_URL_PROD,
  timeout: 10000,
});

// Agregar interceptor para incluir token en cada request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
