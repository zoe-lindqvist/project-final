import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import {
  Music2,
  Calendar,
  Music,
  ArrowLeft,
  UserPlus,
  UserMinus,
} from "lucide-react";
import { useMoodStore } from "../store/moodStore";
import { useAuthStore } from "../store/useAuthStore";

export const UserProfile: React.FC = () => {
  const { userId } = useParams();
  const {
    user: currentUser,
    following,
    followUser,
    unfollowUser,
    users,
  } = useAuthStore();
  const { getUserEntries } = useMoodStore();
  const [profileUser, setProfileUser] = useState<any>(null);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const apiUrl = `${API_BASE_URL}/api/users/${userId}`;
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        setProfileUser(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    if (userId) fetchProfile();
  }, [userId]);

  // const userEntries = getUserEntries(userId || "");
  const isOwnProfile = currentUser?.id === userId;
  const isFollowing = following.includes(userId || "");
  // const profileUser = users.find((u) => u.id === userId);

  const handleFollowToggle = async () => {
    if (isFollowing) {
      await unfollowUser(userId || "");
    } else {
      await followUser(userId || "");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        to="/feed"
        className="inline-flex items-center space-x-2 text-purple-600 dark:text-purple-400 mb-8 hover:text-purple-700 dark:hover:text-purple-300"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back to Feed</span>
      </Link>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Music2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {profileUser?.username || "User"}'s Profile
              </h3>
            </div>
            {!isOwnProfile && (
              <button
                onClick={handleFollowToggle}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isFollowing
                    ? "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    : "bg-purple-600 dark:bg-purple-500 text-white hover:bg-purple-700 dark:hover:bg-purple-600"
                }`}
              >
                {isFollowing ? (
                  <>
                    <UserMinus className="h-4 w-4" />
                    <span>Unfollow</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    <span>Follow</span>
                  </>
                )}
              </button>
            )}
          </div>
          {/* Rest of the profile content remains the same */}
          {/* ... */}
        </div>
        {/* Rest of the component remains the same */}
        {/* ... */}
      </div>
    </div>
  );
};
