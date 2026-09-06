import type RegisterData from "@/models/RegisterData";
import apiClient from "./ApiClient";
import type LoginData from "@/models/LoginData";
import type LoginResponseData from "@/models/LoginResponseData";
import type User from "@/models/User";

export const registerUser = async (signupData: RegisterData) => {
  //api call to server to save data
  const response = await apiClient.post(`auth/register`, signupData);
  return response.data;
};

export const loginUser = async (loginData: LoginData) => {
  const response = await apiClient.post<LoginResponseData>(
    `auth/login`,
    loginData,
  );
  return response.data;
};

export const logoutUser = async () => {
  const response = await apiClient.post(`auth/logout`);
  return response.data;
};

export const getCurrUser = async (emailId: string | undefined) => {
  const response = await apiClient.get<User>(`/users/email/${emailId}`);
  return response.data;
};

export const deleteUser = async (userId: string) => {
  const response = await apiClient.delete(`users/${userId}`);
  return response.data;
};

export const signWithGoogle = async () => {
  const response = await apiClient.get(`oauth2/authorization/google`);
  return response.data;
};
