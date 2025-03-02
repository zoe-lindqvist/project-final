/**
 * **Profile Page**
 *
 * Displays user statistics, mood analysis, and earned badges.
 *
 * **Features:**
 * - **Mood Tracking**: Shows weekly mood statistics based on journal entries.
 * - **User Streaks & Achievements**: Tracks journaling streaks and earned badges.
 * - **Journal Entries**: Displays personal entries with mood analysis and music recommendations.
 *
 * **Accessibility Enhancements:**
 * - Uses `role="region"` and `aria-labelledby` to group sections and enhance screen reader navigation.
 * - Progress bars use `aria-valuenow`, `aria-valuemin`, and `aria-valuemax` for clear feedback.
 * - Entries and badges are rendered with `role="list"` and `role="listitem"` for better list semantics.
 * - All interactive elements include `aria-label` or text for clear screen reader descriptions.
 *
 * **Responsive UI:**
 * - Tailwind CSS ensures consistent styling for both desktop and mobile layouts.
 * - Grid-based design adjusts dynamically for different screen sizes.
 */

import React, { useEffect, useState } from "react";
import { useMoodStore } from "../store/moodStore";
import { useAuthStore } from "../store/useAuthStore";
import { UserProfile } from "../store/useAuthStore";
import {
  Award,
  Calendar,
  Music,
  Play,
  Pause,
  User,
  Users,
  UserPlus,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Profile: React.FC = () => {
  const navigate = useNavigate();

  const { user, fetchUser, followers, following } = useAuthStore();
  const { entries, streak, getMoodStats, getUserEntries } = useMoodStore();
  const [weeklyStats, setWeeklyStats] = useState<{ [key: string]: number }>({});

  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);

  const handleNavigateToProfile = (userId: string) => {
    console.log("Navigating to profile:", userId);
    navigate(`/profile/${userId}`);
  };

  // Fetch user profile data
  useEffect(() => {
    if (user?.id) {
      fetchUser(user.id);
    }
  }, [user?.id, fetchUser]);

  // Fetch mood entries for the user
  useEffect(() => {
    if (user?.id) {
      getUserEntries(user.id); // Fetch mood entries for the logged-in user
    }
  }, [user?.id, getUserEntries]);

  // Calculate weekly mood stats
  useEffect(() => {
    if (entries.length > 0) {
      setWeeklyStats(getMoodStats(7));
    }
  }, [entries, getMoodStats]);

  return (
    <div className="max-w-3xl mx-auto px-2 md:px-4 lg:px-6 py-8">
      <div className="text-center mb-8">
        <h1
          id="journal-title"
          className="text-3xl font-bold text-gray-900 dark:text-white"
        >
          Your Profile
        </h1>
      </div>

      {/* Stats Overview */}
      <div
        className="grid md:grid-cols-3 gap-6 mb-8"
        role="region"
        aria-labelledby="stats-overview"
      >
        <div
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
          role="region"
          aria-labelledby="entries-heading"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Music className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            <h3
              id="entries-heading"
              className="text-lg font-semibold text-gray-900 dark:text-white"
            >
              Total Entries
            </h3>
          </div>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {entries.length}
          </p>
        </div>

        {/* Followers Count */}
        <div
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          onClick={() => setShowFollowersModal(true)}
        >
          <div className="flex items-center space-x-3 mb-4">
            <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Followers
            </h3>
          </div>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {followers.length || 0}
          </p>
        </div>
        {/* Following Count */}
        <div
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          onClick={() => setShowFollowingModal(true)}
        >
          <div className="flex items-center space-x-3 mb-4">
            <UserPlus className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Following
            </h3>
          </div>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {following.length || 0}
          </p>
        </div>
      </div>

      {/* Followers Modal */}
      {showFollowersModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Followers
              </h3>
              <button
                onClick={() => setShowFollowersModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <X className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[calc(80vh-4rem)]">
              {followers.length > 0 ? (
                <div className="space-y-4">
                  {followers.map((follower: UserProfile) => (
                    <div
                      key={follower.id}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                      onClick={() => {
                        console.log("Clicked user:", follower); // Check if this logs
                        console.log("UserId", follower.id); // Check if this logs
                        handleNavigateToProfile(follower.id);
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-full">
                          <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {follower.username}
                          </h4>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No followers yet
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Following Modal */}
      {showFollowingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Following
              </h3>
              <button
                onClick={() => setShowFollowingModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <X className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[calc(80vh-4rem)]">
              {following.length > 0 ? (
                <div className="space-y-4">
                  {following.map((followedUser: UserProfile) => (
                    <div
                      key={followedUser.id}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                      onClick={() => handleNavigateToProfile(followedUser.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-full">
                          <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {followedUser.username}
                          </h4>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  Not following anyone yet
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Weekly Mood Summary */}
      <div
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-8"
        role="region"
        aria-labelledby="weekly-summary-heading"
      >
        <h3
          id="weekly-summary-heading"
          className="text-xl font-semibold text-gray-900 dark:text-white mb-6"
        >
          Weekly Mood Summary
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
          {
            entries.filter((entry) => {
              const entryDate = new Date(entry.createdAt).getTime();
              const cutoffDate = new Date();
              cutoffDate.setDate(cutoffDate.getDate() - 7); // 7 days ago
              return entryDate >= cutoffDate.getTime(); // Only count entries from the past 7 days
            }).length
          }{" "}
          mood entries logged in the past 7 days.
        </p>

        <div
          className="space-y-4"
          role="list"
          aria-label="Weekly Mood Statistics"
        >
          {Object.entries(weeklyStats).map(([mood, percentage]) => (
            <div key={mood} className="space-y-2" role="listitem">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300 capitalize">
                  {mood}
                </span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {percentage}%
                </span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-600 dark:bg-purple-400 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                  role="progressbar"
                  aria-valuenow={percentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Personal Journal Entries */}
      <div
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-8"
        role="region"
        aria-labelledby="journal-entries-heading"
      >
        <h3
          id="journal-entries-heading"
          className="text-xl font-semibold text-gray-900 dark:text-white mb-6"
        >
          Your Journal Entries
        </h3>
        <div role="list" className="space-y-6">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="border-b border-gray-100 dark:border-gray-700 last:border-0 pb-6 last:pb-0"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </p>
                  <span className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-full text-sm font-medium capitalize mt-2">
                    {entry.moodAnalysis}
                  </span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {entry.shared ? "Public" : "Private"}
                </span>
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {entry.userInput}
              </p>

              {entry.suggestedSong && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {entry.suggestedSong.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {entry.suggestedSong.artist}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Badges */}
      <div
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
        role="region"
        aria-labelledby="user-badges-heading"
      >
        <h3
          id="user-badges-heading"
          className="text-xl font-semibold text-gray-900 dark:text-white mb-6"
        >
          Badges
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {user?.badges?.map((badge) => (
            <div
              key={badge.id}
              role="listitem"
              className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
            >
              <span className="text-4xl mb-2 block">{badge.icon}</span>
              <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                {badge.name}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {badge.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
