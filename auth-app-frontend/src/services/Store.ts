import type LoginData from "@/models/LoginData";
import type User from "@/models/User";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { loginUser, logoutUser } from "./AuthService";

const LOCAL_KEY = "auth_app";

type LoginResponseData = {
  accessToken: string;
  user: User;
};

type AuthState = {
  accessToken: string | null;
  user: User | null;
  authStatus: boolean;
  authLoading: boolean;
  updateUser: (user: User) => void;
  login: (LoginData: LoginData) => Promise<LoginResponseData>;
  logout: (options?: { silent?: boolean }) => void;
  checkLogin: () => boolean;
  changeLocalLoginData: (
    accessToken: string,
    user: User,
    authStatus: boolean,
  ) => void;
};

const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      authStatus: false,
      authLoading: false,
      updateUser: (user) => {
        set({ user });
      },
      login: async (loginData) => {
        console.log("Started login...");
        set({ authLoading: true });
        try {
          const loginResponseData = await loginUser(loginData);
          console.log(loginResponseData);
          set({
            accessToken: loginResponseData.accessToken,
            user: loginResponseData.user,
            authStatus: true,
          });
          return loginResponseData;
        } catch (error) {
          throw error;
        } finally {
          set({ authLoading: false });
        }
      },
      logout: async () => {
        try {
          set({ authLoading: true });
          await logoutUser();
        } catch (error) {
          throw error;
        } finally {
          set({ authLoading: false });
        }
        set({
          accessToken: null,
          user: null,
          authLoading: false,
          authStatus: false,
        });
      },
      checkLogin: () => {
        if (get().accessToken && get().authStatus) {
          return true;
        } else {
          return false;
        }
      },
      changeLocalLoginData: (accessToken, user, authStatus) => {
        set({
          accessToken,
          user,
          authStatus,
        });
      },
    }),
    {
      name: LOCAL_KEY,
    },
  ),
);

export default useAuth;
