import axios from "axios";

export const privateInstance = axios.create({
   baseURL: import.meta.env.VITE_BASE_URL,
   headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
   },
});

export const publicInstance = axios.create({
   baseURL: import.meta.env.VITE_BASE_URL,
});
