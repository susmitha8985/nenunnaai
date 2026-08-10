import axios from "axios";
export const api = axios.create({ baseURL: "http://localhost:5000/api" });
export async function getDoctors() { return (await api.get("/doctors")).data.data; }
export async function getLabTests() { return (await api.get("/lab-tests")).data.data; }