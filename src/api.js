import axios from "axios";

export const API = axios.create({
  baseURL: "https://shiv-travels-backend.vercel.app/api"
});
