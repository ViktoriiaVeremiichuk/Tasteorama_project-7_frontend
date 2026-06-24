import axios from "axios";

const SERVER_REQUEST_TIMEOUT_MS = 30_000;

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  timeout: SERVER_REQUEST_TIMEOUT_MS,
});