import axios from "axios";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
});

export const getCategories = async () => {
    const res = await api.get("/api/categories");
    return res.data;
};

export const getIngredients = async () => {
    const res = await api.get("/api/ingredients");
    return res.data;
};