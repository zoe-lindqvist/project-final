import { create } from "zustand";
import { User } from "../types";
import { persist } from "zustand/middleware";
import { useMoodStore } from "./moodStore";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  users: User[];
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
  fetchUser: (userId: string) => Promise<void>;
  following: string[];
  followers: string[];
  followUser: (userId: string) => void;
  unfollowUser: (userId: string) => void;
}
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      accessToken: null,
      users: [],
      following: [],
      followers: [],

      // Fetch User Profile
      fetchUser: async (userId) => {
        try {
          const token =
            get().accessToken || localStorage.getItem("accessToken");

          const response = await fetch(`${API_URL}/api/users/${userId}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch user.");
          }

          const userData = await response.json();
          set({ user: userData }); // Store updated user data, including badges
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      },

      // Login function that interacts with the backend API
      login: async (email, password) => {
        try {
          const response = await fetch(`${API_URL}/api/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Failed to login");
          }

          // Clear previous user's mood data
          useMoodStore.getState().resetMoodData();

          set({
            user: {
              id: data.id,
              username: data.username, // Ensure username is included
              email: data.email,
            },
            isAuthenticated: true,
            accessToken: data.accessToken,
            following: data.following || [],
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
          const response = await fetch(`${API_URL}/api/users/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Failed to register");
          }

          set({
            user: {
              id: data.id,
              username: data.username,
              email: data.email,
            },
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
        useMoodStore.getState().resetMoodData();
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
          const state = get();
          if (state.following.includes(userId)) {
            return;
          }

          const token = localStorage.getItem("accessToken");

          const response = await fetch(
            `${API_URL}/api/users/follow/${userId}`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({}),
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to follow user");
          }

          set((state) => ({
            following: [...state.following, userId],
          }));
        } catch (error) {
          console.error("Error following user:", error);
        }
      },

      // Unfollow a user by ID
      unfollowUser: async (userId) => {
        try {
          const state = get();
          if (!state.following.includes(userId)) {
            return;
          }

          const token = localStorage.getItem("accessToken");
          const response = await fetch(
            `${API_URL}/api/users/unfollow/${userId}`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({}),
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to unfollow user");
          }

          set((state) => ({
            following: state.following.filter((id) => id !== userId),
          }));
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
