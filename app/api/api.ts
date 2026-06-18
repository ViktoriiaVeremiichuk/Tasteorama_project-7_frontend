import axios from "axios";

export const api = axios.create({
  baseURL: "https://tasteorama-project-7-backend.onrender.com",
  withCredentials: true,
});