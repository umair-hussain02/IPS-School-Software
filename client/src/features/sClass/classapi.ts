import axiosInstance from "@/services/axios-instance";

const classApi = {
  getAllClasses: () => axiosInstance.get("/class/getAll-Class"),
};

export default classApi;
