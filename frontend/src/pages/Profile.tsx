import React, { useEffect, useState } from "react";
import { useMoodStore } from "../store/moodStore";
import { useAuthStore } from "../store/useAuthStore";
import { Award, Calendar, Music, Play, Pause } from "lucide-react";

export const Profile: React.FC = () => {
  const { user, fetchUser } = useAuthStore();
  const { entries, streak, getMoodStats, getUserEntries } = useMoodStore();
  const [weeklyStats, setWeeklyStats] = useState<{ [key: string]: number }>({});
  const [visibleEntries, setVisibleEntries] = useState(10); // Start with 10 posts

  useEffect(() => {
    if (user?.id) {
      getUserEntries(user.id); // Fetch mood entries for the logged-in user
      fetchUser(user.id); // Fetch user data including badges
    }
  }, [user, getUserEntries, fetchUser]);

  // Calculate weekly mood stats
  useEffect(() => {
    if (entries.length > 0) {
      setWeeklyStats(getMoodStats(7));
    }
  }, [entries, getMoodStats]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Stats Overview */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-center space-x-3 mb-4">
            <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Current Streak
            </h3>
          </div>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {streak} days
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-center space-x-3 mb-4">
            <Music className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Total Entries
            </h3>
          </div>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {entries.length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-center space-x-3 mb-4">
            <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Badges Earned
            </h3>
          </div>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {user?.badges?.length || 0}
          </p>
        </div>
      </div>

      {/* Weekly Mood Summary */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Weekly Mood Summary
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
          {entries.length} mood entries logged in the past 7 days.
        </p>

        <div className="space-y-4">
          {Object.entries(weeklyStats).map(([mood, percentage]) => (
            <div key={mood} className="space-y-2">
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
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Personal Journal Entries */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          My Journal Entries
        </h3>
        <div className="space-y-6">
          {entries.slice(-visibleEntries).map((entry) => (
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

        {/* View More Button */}
        {visibleEntries < entries.length && (
          <button
            onClick={() => setVisibleEntries(visibleEntries + 10)} // Load 10 more
            className="bg-purple-600 text-white px-4 py-2 rounded-lg mt-4 hover:bg-purple-700 transition"
          >
            View More
          </button>
        )}
      </div>

      {/* Badges */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Badges
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {user?.badges?.map((badge) => (
            <div
              key={badge.id}
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
