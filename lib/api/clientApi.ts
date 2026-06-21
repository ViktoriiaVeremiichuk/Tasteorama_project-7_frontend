import { api } from "@/lib/api/api";

function sortByName<T extends { name: string }>(items: T[]): T[] {
  return [...items].sort((first, second) =>
    first.name.localeCompare(second.name, undefined, { sensitivity: "base" }),
  );
}

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

export const createRecipe = async (
  formData: FormData
) => {
  const res = await api.post(
    "/api/recipes",
    formData,
  );

  return res.data;
};

export const getCategories = async () => {
  const res = await api.get("/api/categories");
  const data = res.data.data;

  return Array.isArray(data) ? sortByName(data) : [];
};

export const getIngredients = async () => {
  const res = await api.get("/api/ingredients");
  const data = res.data.data;

  return Array.isArray(data) ? sortByName(data) : [];
};

export const getMe = async () => {
  const res = await api.get("/api/users/current");
  return res.data;
};

export const logout = async () => {
  const res = await api.post("/api/auth/logout");
  return res.data;
};