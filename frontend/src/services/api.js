import axios from "axios";

const API = axios.create({
  baseURL: "https://blog-backend-rn0w.onrender.com/api"
});

export default API;