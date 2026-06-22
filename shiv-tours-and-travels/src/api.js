import axios from "axios";

export const API = axios.create({
  baseURL: "https://shiv-tours-travels-production.up.railway.app/api"
});