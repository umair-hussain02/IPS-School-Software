import axiosInstance from "@/services/axios-instance";
import type { LoginCredentials } from "@/types/auth.type";

const authAPI = {
  login: (credentials: LoginCredentials) =>
    axiosInstance.post("/login", credentials),
};

export default authAPI;
