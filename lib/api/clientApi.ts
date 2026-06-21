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

export const logout = async (): Promise<void> => {
  await api.post("/api/auth/logout");
};

export const getMe = async () => {
  const res = await api.get("/api/users/current");
  return res.data;
};

export const createRecipe = async (formData: FormData) => {
  const res = await api.post("/api/recipes", formData);

  return res.data;
};

export const getCategories = async () => {
  const res = await api.get("/api/categories");

  return res.data.data;
};

export const getIngredients = async () => {
  const res = await api.get("/api/ingredients");
  return res.data.data;
};
