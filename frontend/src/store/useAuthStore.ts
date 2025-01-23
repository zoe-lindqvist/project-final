import { create } from "zustand";
import { User } from "../types";
import { persist } from "zustand/middleware";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      accessToken: null,

      // Login function that interacts with the backend API
      login: async (email, password) => {
        try {
          const response = await fetch(
            "http://localhost:8080/api/users/login",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, password }),
            }
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Failed to login");
          }

          set({
            user: { id: data.id, email: data.email },
            isAuthenticated: true,
            accessToken: data.accessToken,
          });

          // Save token to local storage
          localStorage.setItem("accessToken", data.accessToken);
        } catch (error) {
          throw error;
        }
      },

      // Register function that interacts with the backend API
      register: async (username, email, password) => {
        try {
          const response = await fetch(
            "http://localhost:8080/api/users/register",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ username, email, password }),
            }
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Failed to register");
          }

          set({
            user: { id: data.id, email },
            isAuthenticated: true,
            accessToken: data.accessToken,
          });

          localStorage.setItem("accessToken", data.accessToken);
        } catch (error) {
          throw error;
        }
      },

      // Logout function to clear the state
      logout: () => {
        set({ user: null, isAuthenticated: false, accessToken: null });
        localStorage.removeItem("accessToken");
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
