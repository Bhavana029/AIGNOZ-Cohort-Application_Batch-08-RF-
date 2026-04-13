import axios from "axios";

const API = axios.create({
  baseURL: "https://aignoz-cohort-application-batch-08-rf.onrender.com/api"
});

API.interceptors.request.use((req) => {

  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;

});

export default API;
