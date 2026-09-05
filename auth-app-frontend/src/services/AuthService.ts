import type RegisterData from "@/models/RegisterData";
import apiClient from "./ApiClient";
import type LoginData from "@/models/LoginData";

export const registerUser = async (signupData: RegisterData) => {
  //api call to server to save data
  const response = await apiClient.post(`/auth/register`, signupData);
  return response.data;
};

export const loginUser = async (loginData: LoginData) => {
  const response = await apiClient.post(`auth/login`, loginData);
  return response.data;
};
