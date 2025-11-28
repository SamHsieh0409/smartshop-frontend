import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true // 必須！讓 Session Cookie 帶過去
});

export default instance;
