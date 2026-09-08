import axios from "axios";

import type RegisterData from "@/models/RegisterData";
import apiClient from "./ApiClient";

import type LoginData from "@/models/LoginData";
import type LoginResponseData from "@/models/LoginResponseData";
import type User from "@/models/User";

const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const registerUser = async (signupData: RegisterData) => {
  const response = await apiClient.post("auth/register", signupData);
  return response.data;
};

export const loginUser = async (loginData: LoginData) => {
  const response = await apiClient.post<LoginResponseData>(
    "auth/login",
    loginData,
  );

  return response.data;
};

export const logoutUser = async () => {
  const response = await apiClient.post("auth/logout");
  return response.data;
};

export const getCurrUser = async (emailId: string | undefined) => {
  const response = await apiClient.get<User>(`/users/email/${emailId}`);
  return response.data;
};

export const refreshToken = async () => {
  const response = await refreshClient.post<LoginResponseData>("/auth/refresh");

  return response.data;
};

export const deleteUser = async (userId: string) => {
  const response = await apiClient.delete(`users/${userId}`);
  return response.data;
};

export const forgotPassword = async (email: string) => {
  const response = await apiClient.post("auth/password/forgot", {
    email,
  });

  return response.data;
};

export const verifyOtp = async (email: string, otp: string) => {
  const response = await apiClient.post<string>("auth/password/verify-otp", {
    email,
    otp,
  });

  return response.data;
};

export const updateProfile = async (name: string) => {
  const response = await apiClient.patch("users/profile", {
    name,
  });

  return response.data;
};

export const resetPassword = async (
  resetToken: string,
  newPassword: string,
) => {
  const response = await apiClient.post("auth/password/reset", {
    resetToken,
    newPassword,
  });

  return response.data;
};

export const changePassword = async (
  currentPassword: string,
  newPassword: string,
) => {
  const response = await apiClient.patch("users/password", {
    currentPassword,
    newPassword,
  });

  return response.data;
};

export const uploadProfileImage = async (file: File) => {
  const formData = new FormData();

  formData.append("image", file);

  const response = await apiClient.post("users/profile/image", formData, {
    headers: {
      "Content-Type": undefined,
    },
  });

  return response.data;
};
