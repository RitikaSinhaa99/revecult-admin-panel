import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/admin",
});

// REQUIRED ADMIN TOKEN
API.interceptors.request.use((req) => {
  req.headers["x-admin-token"] = "secret-admin-token";
  return req;
});

export default API;
