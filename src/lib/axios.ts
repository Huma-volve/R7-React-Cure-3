import axios from "axios";
import { store } from "@/redux/store";
import { logout } from "@/redux/auth/authSlice";



const api = axios.create({
  baseURL: "https://round7-cure.huma-volve.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// This runs automatically before every request
api.interceptors.request.use((config) => {
  const token = store.getState().auth?.token; // read token from Redux
  const expiresAt = store.getState().auth?.expiresAt;

  // If a token exists and the request did not disable auth, add it
  if (token && expiresAt) {
    if (Date.now() > expiresAt) {
      store.dispatch(logout()); 
      throw new axios.Cancel("Token expired");
    }
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config; // always return config, otherwise the request won’t continue
}, (error) => {
  return Promise.reject(error);
});

// (Optional) handle errors from responses in one place
api.interceptors.response.use(
  (response) => response, // just return data if successful
  (error) => {
    // You could log errors or handle 401 (unauthorized) here
    return Promise.reject(error);
  }
);

export default api;
