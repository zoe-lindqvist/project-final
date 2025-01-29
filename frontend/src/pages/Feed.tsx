import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, MessageCircle, Play, Pause, User, Search } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { moodCategories, filterByCategory } from "../utils/moodUtils";
import { genreCategories, mapToGenreCategory } from "../utils/genreUtils";
import { MoodCategory } from "../types";
import TextareaAutosize from "react-textarea-autosize";
import axios from "axios";

export const Feed: React.FC = () => {
  const [entries, setEntries] = useState<any[]>([]); // Store entries from API
  const { user, accessToken } = useAuthStore(); // Access user and token from Zustand store
  const [moodFilter, setMoodFilter] = useState<string>("all");
  const [genreFilter, setGenreFilter] = useState<string>("all");
  const [showFollowingOnly, setShowFollowingOnly] = useState(false);
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});
  const [playingAudio, setPlayingAudio] = useState<{
    [key: string]: HTMLAudioElement;
  }>({});
  const [isPlaying, setIsPlaying] = useState<{ [key: string]: boolean }>({});
  const [searchQuery, setSearchQuery] = useState(""); // search input
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [following, setFollowing] = useState<string[]>([]); // Store the following list

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const response = await axios.get(
          "https://project-final-fo1y.onrender.com/api/moods/feed", // add render
          {
            headers: {
              Authorization: `Bearer ${
                accessToken || localStorage.getItem("accessToken")
              }`,
            },
          }
        );

        setEntries(response.data);
      } catch (error) {
        console.error("Error fetching feed:", error);
      }
    };

    fetchFeed();
  }, []);

  //Search Functionality
  useEffect(() => {
    const searchUsers = async () => {
      if (!searchQuery) {
        setSearchResults([]); // Clear results if input is empty
        return;
      }

      try {
        const response = await axios.get(
          `https://project-final-fo1y.onrender.com/api/users/search?username=${searchQuery}`,
          {
            headers: {
              Authorization: `Bearer ${
                accessToken || localStorage.getItem("accessToken")
              }`,
            },
          }
        );

        setSearchResults(response.data);
      } catch (error) {
        console.error("Error searching users:", error);
      }
    };

    searchUsers();
  }, [searchQuery]);

  // const filteredEntries =
  //   moodFilter === "all"
  //     ? entries
  //     : filterByCategory(entries, moodFilter as MoodCategory);

  const filteredEntries = entries.filter((entry) => {
    // Mood filtering: If a specific mood is selected, only show matching moods
    const matchesMood =
      moodFilter === "all"
        ? entries
        : filterByCategory(entries, moodFilter as MoodCategory);

    // Genre filtering: If a specific genre is selected, only show matching genres
    const entryGenre = entry.suggestedSong?.genre || "mixed"; // Get genre from API
    const mappedGenre = mapToGenreCategory(entryGenre); // Map it to main category
    const matchesGenre = genreFilter === "all" || mappedGenre === genreFilter;

    // Show the entry only if it matches BOTH filters
    return matchesMood && matchesGenre;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search and Filter Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Users */}
          <div className="relative flex-1">
            <div className="flex items-center bg-gray-50 dark:bg-gray-700 rounded-lg p-2 relative">
              <Search className="h-5 w-5 text-gray-400 ml-2" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-transparent focus:outline-none text-gray-900 dark:text-white"
              />
            </div>

            {/* Search Results Dropdown */}
            {searchResults && searchQuery && (
              <div className="absolute w-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50">
                {searchResults.length > 0 ? (
                  searchResults.map((user) => (
                    <Link
                      key={user.id}
                      to={`/profile/${user.id}`}
                      className="flex items-center space-x-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => {
                        setSearchQuery("");
                        setSearchResults([]); // ✅ Clears search results properly
                      }}
                    >
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-full">
                        <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {user.username}
                      </span>
                    </Link>
                  ))
                ) : (
                  <div className="p-4 text-gray-500 dark:text-gray-400">
                    No users found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Filters */}
          <div className="flex gap-4">
            <select
              value={moodFilter}
              onChange={(e) => setMoodFilter(e.target.value)}
              className="px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-0"
            >
              <option value="all">All Moods</option>

              {Object.keys(moodCategories).map((category) => (
                <option key={category} value={category}>
                  {" "}
                  {category.charAt(0).toUpperCase() + category.slice(1)}{" "}
                </option>
              ))}
            </select>
            <select
              value={genreFilter}
              onChange={(e) => setGenreFilter(e.target.value)}
              className="px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-0"
            >
              <option value="all">All Genres</option>
              {Object.keys(genreCategories).map((genre) => (
                <option key={genre} value={genre}>
                  {genre.charAt(0).toUpperCase() + genre.slice(1)}
                </option>
              ))}
            </select>
            {/* <select
              value={genreFilter}
              onChange={(e) => setGenreFilter(e.target.value)}
              className="px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-0"
            >
              <option value="all">All Genres</option>
              <option value="Rock">Rock</option>
              <option value="Pop">Pop</option>
              <option value="Jazz">Jazz</option>
              <option value="Classical">Classical</option>
            </select> */}
            <button
              onClick={() => setShowFollowingOnly(!showFollowingOnly)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                showFollowingOnly
                  ? "bg-purple-600 dark:bg-purple-500 text-white"
                  : "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              <User className="h-5 w-5" />
              <span>Following</span>
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {filteredEntries.length > 0 ? (
          filteredEntries.map((entry) => (
            <div
              key={entry._id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <Link
                  to={`/profile/${entry.userId._id}`}
                  className="flex items-center space-x-3 group"
                >
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-full transform transition-transform group-hover:scale.110">
                    <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">
                      {entry.userId.username || "Unknown User"}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-full text-sm font-medium capitalize">
                  {entry.moodAnalysis}
                </span>
              </div>
              {/* <div className="flex justify-end w-full"></div> */}
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {entry.userInput}
              </p>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4">
                {/* <h4 className="font-medium text-gray-900 dark:text-white">
                  {entry.suggestedSong.title}
                </h4> */}
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {entry.suggestedSong.genre}
                </p>
              </div>

              {/* Spotify Embedded Player */}
              {entry.suggestedSong.spotifyLink && (
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
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-400">
            No moods shared yet.
          </p>
        )}
      </div>
    </div>
  );
};
