import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
});

export const register = async(data: {
    name:string,
    email:string,
    password:string,
}) => {
    const res = await api.post('/auth/register', data);
    return res.data;
}

export const login = async(data: {
    email:string,
    password:string,
}) => {
    const res = await api.post('/auth/login', data);
    return res.data;
}