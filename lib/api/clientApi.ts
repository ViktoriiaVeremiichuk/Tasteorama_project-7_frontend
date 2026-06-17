import { api } from "@/lib/api/api";

export const register = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const res = await api.post("/api/auth/register", data);
  return res.data;
};

export const login = async (data: { email: string; password: string }) => {
  const res = await api.post("/api/auth/login", data);
  return res.data;
};
