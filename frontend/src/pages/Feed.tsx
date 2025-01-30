import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  Filter,
  MessageCircle,
  Music,
  Play,
  Pause,
  User,
  Search,
  ChevronUp,
  ChevronDown,
  X,
  Sliders,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { moodCategories, filterByCategory } from "../utils/moodUtils";
import { genreCategories, mapToGenreCategory } from "../utils/genreUtils";
import { MoodCategory, Comment } from "../types";
import TextareaAutosize from "react-textarea-autosize";
import axios from "axios";

//--------------------------------------------------------
export const Feed: React.FC = () => {
  const [entries, setEntries] = useState<any[]>([]); // Store entries from API
  const { user, accessToken } = useAuthStore(); // Access user and token from Zustand store

  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [moodFilter, setMoodFilter] = useState<string>("all");
  const [genreFilter, setGenreFilter] = useState<string>("all");
  const [showFollowingOnly, setShowFollowingOnly] = useState(false);
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({}); //store comments per entry
  const [comments, setComments] = useState<{ [key: string]: Comment[] }>({});

  const [expandedComments, setExpandedComments] = useState<{
    [key: string]: boolean;
  }>({});

  const [likes, setLikes] = useState<{ [key: string]: Comment[] }>({});
  const [userLiked, setUserLiked] = useState<{ [key: string]: boolean }>({});

  const [searchQuery, setSearchQuery] = useState(""); // search input
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [following, setFollowing] = useState<string[]>([]); // Store the following list

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  // Like Functionality
  const handleToggleLike = async (entryId: string) => {
    if (!user) return;

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/moods/like/${entryId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${
              accessToken || localStorage.getItem("accessToken")
            }`,
          },
        }
      );
      if (response.status === 200) {
        console.log("Updated likes from backend:", response.data.likes); // Should now be an array
        console.log("Likes count from backend:", response.data.likesCount); // Should be a number
        // ✅ Ensure likes is always an array
        const updatedLikes: string[] = Array.isArray(response.data.likes)
          ? response.data.likes
          : [];
        setEntries((prevEntries) =>
          prevEntries.map((entry) =>
            entry._id === entryId ? { ...entry, likes: updatedLikes } : entry
          )
        );

        // Update `userLiked` state
        setUserLiked((prevLiked) => ({
          ...prevLiked,
          [entryId]: updatedLikes.includes(user.id),
        }));
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  // Comment Functionality
  const handleCommentSubmit = async (entryId: string) => {
    if (!user || !commentText[entryId]?.trim()) return;

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/moods/${entryId}/comments`,
        { text: commentText[entryId] },
        {
          headers: {
            Authorization: `Bearer ${
              accessToken || localStorage.getItem("accessToken")
            }`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        const commentsArray = response.data.comments || [];
        const lastComment =
          commentsArray.length > 0 ? commentsArray.at(-1) : null;

        if (!lastComment) return;

        const newComment: Comment = {
          _id: lastComment._id,
          userId: {
            _id: lastComment.userId._id,
            username: lastComment.userId.username || "Unknown",
          },
          comment: lastComment.comment,
          createdAt: lastComment.createdAt,
        };

        setComments((prev) => ({
          ...prev,
          [entryId]: [...(prev[entryId] || []), newComment],
        }));

        setCommentText((prev) => ({
          ...prev,
          [entryId]: "",
        }));
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  // Fetch comments
  useEffect(() => {
    if (!user) return;

    const fetchComments = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/moods/feed`, {
          headers: {
            Authorization: `Bearer ${
              accessToken || localStorage.getItem("accessToken")
            }`,
          },
        });

        // Ensure each mood entry's comments are stored with username included
        const commentsMap: { [key: string]: Comment[] } = {};

        response.data.forEach((entry: any) => {
          commentsMap[entry._id] = entry.comments.map((comment: any) => ({
            _id: comment._id,
            userId: {
              _id: comment.userId._id,
              username: comment.userId.username || "Unknown", // Ensure username is included
            },
            comment: comment.comment,
            createdAt: comment.createdAt,
          }));
        });

        setComments(commentsMap); // Store all comments in state
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [user]);

  useEffect(() => {
    if (!user) return;
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

        // Check which moods the user has already liked
        const likedMoods = response.data.reduce(
          (
            acc: { [key: string]: boolean },
            mood: { _id: string; likes: string[] }
          ) => {
            acc[mood._id] = mood.likes.includes(user.id); // Check if user is in the likes array
            return acc;
          },
          {} // Initial value
        );

        setUserLiked(likedMoods); // Store liked moods in state
      } catch (error) {
        console.error("Error fetching feed:", error);
      }
    };

    fetchFeed();
  }, [user]);

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

  const filteredEntries = entries.filter((entry) => {
    const entryGenre = entry.suggestedSong?.genre || "mixed";
    const mappedGenre = mapToGenreCategory(entryGenre);
    const matchesMood =
      moodFilter === "all" ||
      filterByCategory([entry], moodFilter as MoodCategory).length > 0;
    const matchesGenre = genreFilter === "all" || mappedGenre === genreFilter;

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
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-auto">
              {/* Mood Filter Icon */}
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-600 dark:text-purple-400 pointer-events-none" />

              {/* Mood Filter Select */}
              <select
                value={moodFilter}
                onChange={(e) => setMoodFilter(e.target.value)}
                className="pl-12 pr-6 py-3 md:py-3.5 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-0 w-full md:w-auto appearance-none"
              >
                <option value="all">Moods</option>
                {Object.keys(moodCategories).map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Genre Filter */}
            <select
              value={genreFilter}
              onChange={(e) => setGenreFilter(e.target.value)}
              className="px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-0 w-full md:w-auto"
            >
              <option value="all">Genres</option>
              {Object.keys(genreCategories).map((genre) => (
                <option key={genre} value={genre}>
                  {genre.charAt(0).toUpperCase() + genre.slice(1)}
                </option>
              ))}
            </select>

            {/* Following Button */}
            <button
              onClick={() => setShowFollowingOnly(!showFollowingOnly)}
              className={`flex items-center justify-center w-full md:w-auto space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
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

              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {entry.userInput}
              </p>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4">
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

              {/* Like Button */}
              <button
                onClick={() => handleToggleLike(entry._id)}
                className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400"
                // className={`flex items-center space-x-2 text-sm
                //   ${
                //   userLiked[entry._id]
                //     ? "text-purple-500"
                //     : "text-gray-500 dark:text-gray-400"
                // }`}
              >
                <Heart
                  className={`h-5 w-5 ${
                    userLiked[entry._id] ? "fill-current text-purple-600" : ""
                  }`}
                />
                <span>{entry.likes.length}</span>
              </button>

              {/* Comments Section */}
              <div className="mt-4">
                {/* Display existing comments */}
                {comments[entry._id]?.length > 0 && (
                  <div className="space-y-2">
                    {/* Handle different sorting for collapsed vs. expanded */}
                    {(expandedComments[entry._id]
                      ? [...comments[entry._id]] // Copy array for expanded view (oldest to newest)
                      : [...comments[entry._id]].slice(-2)
                    ) // Copy last 2 comments and reverse them (second most recent on top)
                      .map((comment, index) => (
                        <div
                          key={comment._id || index}
                          className="flex items-start space-x-3"
                        >
                          <div className="p-2 bg-gray-100 dark:bg-gray-700/50 rounded-full">
                            <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-baseline space-x-2">
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {comment.userId?.username || "Anonymous"}
                              </h4>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(
                                  comment.createdAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300">
                              {comment.comment}
                            </p>
                          </div>
                        </div>
                      ))}

                    {/* Expand/Collapse Button */}
                    {comments[entry._id].length > 2 && (
                      <button
                        onClick={() =>
                          setExpandedComments((prev) => ({
                            ...prev,
                            [entry._id]: !prev[entry._id], // Toggle state
                          }))
                        }
                        className="flex items-center text-sm text-purple-600 dark:text-purple-400 mt-2"
                      >
                        {expandedComments[entry._id] ? (
                          <>
                            <span>Show less</span>
                            <ChevronUp className="h-4 w-4 ml-1" />
                          </>
                        ) : (
                          <>
                            <span>
                              Show all {comments[entry._id].length} comments
                            </span>
                            <ChevronDown className="h-4 w-4 ml-1" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                )}

                {/* Comment Input */}
                {user && (
                  <div className="relative mt-3">
                    <TextareaAutosize
                      value={commentText[entry._id] || ""}
                      onChange={(e) =>
                        setCommentText({
                          ...commentText,
                          [entry._id]: e.target.value,
                        })
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault(); // Prevents newline when pressing Enter
                          handleCommentSubmit(entry._id); // Triggers comment submit
                        }
                      }}
                      placeholder="Add a comment..."
                      className="w-full min-h-[2.5rem] px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                    />
                    <button
                      onClick={() => {
                        handleCommentSubmit(entry._id);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                    >
                      <MessageCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </button>
                  </div>
                )}
              </div>
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
