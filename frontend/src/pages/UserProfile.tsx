/**
 * **User Profile Page**
 *
 * Displays a user's public journal entries and provides follow/unfollow functionality.
 *
 * **Features:**
 * - **Profile Overview**: Shows the user's name and public mood entries.
 * - **Follow System**: Enables authenticated users to follow/unfollow others.
 * - **Public Mood Entries**: Displays mood logs with analysis and song recommendations.
 * - **Spotify Integration**: Embeds a Spotify player for suggested tracks.
 *
 * **Accessibility Enhancements:**
 * - Uses `role="region"` and `aria-labelledby` for structured screen reader navigation.
 * - `aria-live="polite"` announces updates (loading, new entries) dynamically.
 * - `tabIndex={0}` improves keyboard navigation on key sections.
 * - Buttons and links include `aria-label` for better clarity.
 *
 * **Responsive UI:**
 * - Built with Tailwind CSS for an optimized experience across devices.
 */

import { useEffect, useState } from "react";
import { User, Music2, ArrowLeft, UserPlus, UserMinus } from "lucide-react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export const UserProfile: React.FC = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuthStore();
  const [profileUser, setProfileUser] = useState<any>(null);
  const [publicEntries, setPublicEntries] = useState<any[]>([]);

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const apiUrl = `${API_BASE_URL}/api/moods/public-profile/${userId}`;
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        setProfileUser(response.data.user);
        setPublicEntries(response.data.publicEntries);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  const isOwnProfile = currentUser?.id === userId;
  const isFollowing =
    currentUser &&
    profileUser?.followers?.some(
      (follower: { id: string }) => follower.id === currentUser.id
    );

  const handleFollowToggle = async () => {
    try {
      const url = isFollowing
        ? `${API_BASE_URL}/api/users/unfollow/${userId}`
        : `${API_BASE_URL}/api/users/follow/${userId}`;

      await axios.post(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      setProfileUser((prev: { followers: { id: string }[] }) => ({
        ...prev,
        followers: isFollowing
          ? prev.followers.filter((follower) => follower.id !== currentUser!.id) // Remove follower
          : [...prev.followers, { id: currentUser!.id }], // Add follower
      }));
    } catch (error) {
      console.error("Error toggling follow state:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        to="/feed"
        className="inline-flex items-center space-x-2 text-purple-600 dark:text-purple-400 mb-8 hover:text-purple-700 dark:hover:text-purple-300"
        aria-label="Go back to feed"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back to Feed</span>
      </Link>
      {profileUser ? (
        <>
          {/* Profile Header */}
          <div
            className="flex flex-col items-center justify-center text-center bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-8 w-full max-w-3xl mx-auto"
            role="region"
            aria-labelledby="profile-heading"
            tabIndex={0}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-3">
                <Music2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                <h3
                  id="profile-heading"
                  className="text-lg font-semibold text-gray-900 dark:text-white"
                >
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
                  aria-label={isFollowing ? "Unfollow user" : "Follow user"}
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
          </div>

          {/* Public Mood Entries */}
          <div
            className="space-y-6"
            role="region"
            aria-labelledby="public-entries-heading"
            tabIndex={0}
          >
            {publicEntries.length === 0 ? (
              <p
                className="text-gray-500 dark:text-gray-400"
                aria-live="polite"
              >
                No public mood entries available.
              </p>
            ) : (
              publicEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
                  role="article"
                  aria-labelledby={`entry-${entry.id}-title`}
                  tabIndex={0}
                >
                  {/* Header: User Info & Mood Tag */}
                  <div className="flex items-start justify-between mb-4">
                    <Link
                      to={`/profile/${entry.userId.id}`}
                      className="flex items-center space-x-3 group"
                      aria-label={`View ${profileUser.username}'s profile`}
                    >
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-full transform transition-transform group-hover:scale-110">
                        <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h3
                          id={`entry-${entry.id}-title`}
                          className="font-medium text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400"
                        >
                          {profileUser.username || "Unknown User"}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(entry.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </Link>

                    <span
                      className="px-3 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-full text-sm font-medium capitalize"
                      role="status"
                    >
                      {entry.moodAnalysis}
                    </span>
                  </div>

                  {/* Mood Entry Text */}
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {entry.userInput}
                  </p>

                  {/* Suggested Song Genre */}
                  {entry.suggestedSong && (
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {entry.suggestedSong.genre}
                      </p>
                    </div>
                  )}

                  {/* Spotify Embedded Player */}
                  {entry.suggestedSong?.spotifyLink && (
                    <div className="mt-6">
                      <iframe
                        src={`https://open.spotify.com/embed/track/${entry.suggestedSong.spotifyLink
                          .split("/")
                          .pop()}`}
                        className="w-full h-32 rounded-lg shadow-lg"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                      ></iframe>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <p
          className="text-gray-500 dark:text-gray-400 text-center"
          aria-live="polite"
        >
          Loading user profile...
        </p>
      )}
    </div>
  );
};
