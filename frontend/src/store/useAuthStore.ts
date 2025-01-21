import { create } from "zustand";
import { User } from "../types";
import { persist } from "zustand/middleware";

interface AuthState {
  user: User | null; // Holds currently logged-in user or null if not authenticated
  isAuthenticated: boolean; // Tracks whether user is authenticated
  users: User[]; // List of users (mocked for demo purposes)
  following: string[]; // List of user IDs that the current user is following
  login: (user: User) => void; // Function to log in a user
  logout: () => void; // Function to log out a user
  followUser: (userId: string) => void; // Function to follow a user
  unfollowUser: (userId: string) => void; // Function to unfollow a user
  searchUsers: (query: string) => User[]; // Function to search for users by name
}

// Zustand store with persistence enabled
export const userAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      users: [],
      following: [],

      // Function to log in a user
      login: (user) => {
        // Mock user data
        const mockUsers = [
          { id: "2", email: "elton@rocketman.com", name: "Elton John" },
          { id: "3", email: "stevie@wonder.com", name: "Stevie Wonder" },
          { id: "4", email: "taylor@swiftie.com", name: "Taylor Swift" },
        ];
        set({ user, isAuthenticated: true, users: mockUsers }); // Update state with logged-inuser and mock users
      },

      // Function to log out the user
      logout: () =>
        set({ user: null, isAuthenticated: false, users: [], following: [] }),

      // Function to follow a user by adding their ID to the following list
      followUser: (userId) =>
        set((state) => ({
          following: [...state.following, userId], // Append the new User ID to the list
        })),

      // Function to unfollow a user by removing their ID from the following list
      unfollowUser: (userId) =>
        set((state) => ({
          following: state.following.filter((id) => id !== userId), // Remove the user ID from the list
        })),

      // Function to search for users by name
      searchUsers: (query) => {
        const state = get(); // Get the current state
        if (!query.trim()) return []; // If the query is empty, return an empty array
        return state.users.filter(
          (user) =>
            user.name.toLowerCase().includes(query.toLowerCase()) && // Check if name matches query
            user.id !== state.user?.id // Exclude the current user from the search results
        );
      },
    }),
    {
      name: "auth-storage", // Key used for persisting state in local storage
    }
  )
);
