import { useState, useEffect, useRef, useCallback } from "react";
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

export const Feed: React.FC = () => {
  const [entries, setEntries] = useState<any[]>([]); // Store entries from API
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const observer = useRef<IntersectionObserver | null>(null);

  const { user, accessToken } = useAuthStore(); // Access user and token from Zustand store

  // const [showFilterMenu, setShowFilterMenu] = useState(false);
  // const [filterType, setFilterType] = useState("");
  const [moodFilter, setMoodFilter] = useState<string>("all");
  const [genreFilter, setGenreFilter] = useState<string>("all");
  const [showFollowingOnly, setShowFollowingOnly] = useState(false);
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({}); //store comments per entry
  const [comments, setComments] = useState<{ [key: string]: Comment[] }>({});

  const [expandedComments, setExpandedComments] = useState<{
    [key: string]: boolean;
  }>({});

  // const [likes, setLikes] = useState<{ [key: string]: Comment[] }>({});
  const [userLiked, setUserLiked] = useState<{ [key: string]: boolean }>({});

  const [searchQuery, setSearchQuery] = useState(""); // search input
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [following, setFollowing] = useState<string[]>([]); // Store the following list

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

  useEffect(() => {
    console.log("🛠 Zustand user state updated:", useAuthStore.getState().user);
  }, [useAuthStore.getState().user]);

  // Like Functionality
  const handleToggleLike = async (entryId: string) => {
    const zustandUser = useAuthStore.getState().user; // Get the user from Zustand

    console.log("🛠 Checking Zustand user state:", zustandUser);

    if (!zustandUser || !zustandUser.id) {
      console.error("❌ User ID is undefined, cannot like/unlike.");
      return;
    }

    console.log(
      `✅ User ID: ${zustandUser.id}, Attempting to like/unlike mood ${entryId}`
    );

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
        const updatedLikes = response.data.likes || [];

        console.log("🔍 API Response Likes:", updatedLikes);

        setEntries((prevEntries) =>
          prevEntries.map((entry) =>
            entry.id === entryId ? { ...entry, likes: updatedLikes } : entry
          )
        );

        setUserLiked((prevLiked) => ({
          ...prevLiked,
          [entryId]: updatedLikes.includes(zustandUser.id),
        }));
      }
    } catch (error) {
      console.error("❌ Error liking post:", error);
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
          id: lastComment.id,
          userId: {
            id: lastComment.userId.id,
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
          commentsMap[entry.id] = entry.comments.map((comment: any) => ({
            id: comment.id,
            userId: {
              id: comment.userId.id,
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

  // Fetch feed
  // useEffect(() => {
  //   if (!user) return;

  //   const fetchFeed = async () => {
  //     try {
  //       const filterQuery = showFollowingOnly ? "?filter=following" : "";
  //       const response = await axios.get(
  //         `${API_BASE_URL}/api/moods/latest${filterQuery}`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${
  //               accessToken || localStorage.getItem("accessToken")
  //             }`,
  //           },
  //         }
  //       );

  //       setEntries(response.data);

  //       // Check which moods the user has already liked
  //       const likedMoods = response.data.reduce(
  //         (
  //           acc: { [key: string]: boolean },
  //           mood: { id: string; likes: string[] }
  //         ) => {
  //           acc[mood.id] = mood.likes.some((like) => like === user.id);
  //           return acc;
  //         },
  //         {}
  //       );

  //       setUserLiked(likedMoods); // Store liked moods in state
  //     } catch (error) {
  //       console.error("Error fetching feed:", error);
  //     }
  //   };

  //   fetchFeed();
  // }, [user, showFollowingOnly]);

  useEffect(() => {
    if (!user) return;

    const fetchInitialFeed = async () => {
      try {
        const filterQuery = showFollowingOnly ? "?filter=following" : "";
        const response = await axios.get(
          `${API_BASE_URL}/api/moods/latest?page=1&limit=10${filterQuery}`,
          {
            headers: {
              Authorization: `Bearer ${
                accessToken || localStorage.getItem("accessToken")
              }`,
            },
          }
        );

        setEntries(response.data.moods); // Set initial entries
        setPage(2); // Prepare for next page
        setHasMore(response.data.hasMore);

        // Check which moods the user has already liked
        const likedMoods = response.data.moods.reduce(
          (
            acc: { [key: string]: boolean },
            mood: { id: string; likes: string[] }
          ) => {
            acc[mood.id] = mood.likes.some((like) => like === user.id);
            return acc;
          },
          {}
        );

        setUserLiked(likedMoods); // Store liked moods in state
      } catch (error) {
        console.error("Error fetching feed:", error);
      }
    };

    fetchInitialFeed();
  }, [user, showFollowingOnly]);

  const fetchMoreMoods = useCallback(async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/moods/latest?page=${page}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${
              accessToken || localStorage.getItem("accessToken")
            }`,
          },
        }
      );

      if (response.data.moods.length === 0) {
        setHasMore(false); // No more data
      } else {
        setEntries((prev) => [...prev, ...response.data.moods]); // Append new moods
        setPage((prev) => prev + 1); // Increment page number
      }
    } catch (error) {
      console.error("Error fetching more moods:", error);
      setHasMore(false); // Stop infinite scrolling on error
    }
    setLoading(false);
  }, [page, hasMore, loading]);

  const lastMoodRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || !hasMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            fetchMoreMoods();
          }
        },
        { threshold: 1 }
      );

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, fetchMoreMoods]
  );

  //Search Functionality
  useEffect(() => {
    const searchUsers = async () => {
      if (!searchQuery) {
        setSearchResults([]); // Clear results if input is empty
        return;
      }

      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/users/search?username=${searchQuery}`,
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
    const entryGenre = entry.suggestedSong?.genre;
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
                        setSearchResults([]); // Clears search results properly
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
            <div className="relative w-full md:w-auto">
              {/* Genre Filter Icon */}
              <Music className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-600 dark:text-purple-400 pointer-events-none" />

              {/* Genre Filter Select */}
              <select
                value={genreFilter}
                onChange={(e) => setGenreFilter(e.target.value)}
                className="pl-12 pr-6 py-3 md:py-3.5 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-0 w-full md:w-auto appearance-none"
              >
                <option value="all">Genres</option>
                {Object.keys(genreCategories).map((genre) => (
                  <option key={genre} value={genre}>
                    {genre.charAt(0).toUpperCase() + genre.slice(1)}
                  </option>
                ))}
              </select>
            </div>

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
          filteredEntries.map((entry, index) => {
            const isLastEntry = index === filteredEntries.length - 1; // Check if this is the last entry

            return (
              <div
                key={entry.id}
                ref={isLastEntry ? lastMoodRef : null} // Attach lastMoodRef to the last entry
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <Link
                    to={`/profile/${entry.userId.id}`}
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
                  onClick={() => handleToggleLike(entry.id)}
                  className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400"
                >
                  <Heart
                    className={`h-5 w-5 ${
                      userLiked[entry.id] ? "fill-current text-purple-600" : ""
                    }`}
                  />
                  <span>{entry.likes.length}</span>
                </button>

                {/* Comments Section */}
                <div className="mt-4">
                  {comments[entry.id]?.length > 0 && (
                    <div className="space-y-2">
                      {(expandedComments[entry.id]
                        ? [...comments[entry.id]]
                        : [...comments[entry.id]].slice(-2)
                      ).map((comment, index) => (
                        <div
                          key={comment.id || index}
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

                      {comments[entry.id].length > 2 && (
                        <button
                          onClick={() =>
                            setExpandedComments((prev) => ({
                              ...prev,
                              [entry.id]: !prev[entry.id], // Toggle state
                            }))
                          }
                          className="flex items-center text-sm text-purple-600 dark:text-purple-400 mt-2"
                        >
                          {expandedComments[entry.id] ? (
                            <>
                              <span>Show less</span>
                              <ChevronUp className="h-4 w-4 ml-1" />
                            </>
                          ) : (
                            <>
                              <span>
                                Show all {comments[entry.id].length} comments
                              </span>
                              <ChevronDown className="h-4 w-4 ml-1" />
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  )}

                  {user && (
                    <div className="relative mt-3">
                      <TextareaAutosize
                        value={commentText[entry.id] || ""}
                        onChange={(e) =>
                          setCommentText({
                            ...commentText,
                            [entry.id]: e.target.value,
                          })
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleCommentSubmit(entry.id);
                          }
                        }}
                        placeholder="Add a comment..."
                        className="w-full min-h-[2.5rem] px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                      />
                      <button
                        onClick={() => {
                          handleCommentSubmit(entry.id);
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                      >
                        <MessageCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-400">
            {loading ? "Loading moods..." : "No more moods to load!"}
          </p>
        )}
        {loading && (
          <p className="text-center text-gray-500">Loading more...</p>
        )}
      </div>
      ;
    </div>
  );
};
