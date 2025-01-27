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
  fetchUserProfile: (userId: string) => Promise<User | null>;
  logout: () => void;
  following: string[];
  followers: string[];
  followUser: (userId: string) => void;
  unfollowUser: (userId: string) => void;
}
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      accessToken: null,
      following: [],
      followers: [],

      // Login function that interacts with the backend API
      login: async (email, password) => {
        try {
          const response = await fetch(`${API_URL}/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

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
          const response = await fetch(`${API_URL}/users/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password }),
          });

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

      // Fetch user profile by ID from backend API
      fetchUserProfile: async (userId: string): Promise<User | null> => {
        try {
          const response = await fetch(`${API_URL}/users/${userId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch user profile");
          }

          const user = await response.json();
          return user;
        } catch (error) {
          console.error("Error fetching user profile:", error);
          return null;
        }
      },

      // Logout function to clear the state
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          accessToken: null,
          following: [],
          followers: [],
        });
        localStorage.removeItem("accessToken");
      },

      // Follow a user by ID
      followUser: async (userId) => {
        try {
          const response = await fetch(`${API_URL}/users/follow/${userId}`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          });

          if (response.ok) {
            set((state) => ({
              following: [...state.following, userId],
            }));
          } else {
            throw new Error("Failed to follow user");
          }
        } catch (error) {
          console.error("Error following user:", error);
        }
      },

      // Unfollow a user by ID
      unfollowUser: async (userId) => {
        try {
          const response = await fetch(`${API_URL}/users/unfollow/${userId}`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          });

          if (response.ok) {
            set((state) => ({
              following: state.following.filter((id) => id !== userId),
            }));
          } else {
            throw new Error("Failed to unfollow user");
          }
        } catch (error) {
          console.error("Error unfollowing user:", error);
        }
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
