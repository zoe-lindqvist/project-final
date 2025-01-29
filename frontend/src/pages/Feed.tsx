import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, MessageCircle, Play, Pause, User, Search } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
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
  const [searchQuery, setSearchQuery] = useState("");
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

  //   const fetchUser = async () => {
  //     try {
  //       const response = await axios.get(
  //         "http://localhost:8080/api/users/profile",
  //         {
  //           headers: {
  //             Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  //           },
  //         }
  //       );
  //       setUser(response.data.user);
  //     } catch (error) {
  //       console.error("Error fetching user:", error);
  //     }
  //   };

  //   fetchUser();
  // }, []);

  // // Fetch entries from the API
  // useEffect(() => {
  //   const fetchEntries = async () => {
  //     try {
  //       const response = await axios.get("/api/entries", {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  //         },
  //       });
  //       setEntries(response.data);
  //     } catch (error) {
  //       console.error("Error fetching entries:", error);
  //     }
  //   };

  //   if (user) fetchEntries();
  // }, [user]);

  // // Fetch the following list from the API
  // useEffect(() => {
  //   const fetchFollowing = async () => {
  //     try {
  //       const response = await axios.get("/api/users/following", {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  //         },
  //       });
  //       setFollowing(response.data); // Assuming response.data is an array of user IDs
  //     } catch (error) {
  //       console.error("Error fetching following list:", error);
  //     }
  //   };

  //   if (user) fetchFollowing();
  // }, [user]);

  // // Search users through the API
  // useEffect(() => {
  //   const searchUsers = async () => {
  //     if (!searchQuery) return setSearchResults([]);
  //     try {
  //       const response = await axios.get(`/api/users?search=${searchQuery}`);
  //       setSearchResults(response.data); // Assuming response.data is an array of users
  //     } catch (error) {
  //       console.error("Error searching users:", error);
  //     }
  //   };

  //   searchUsers();
  // }, [searchQuery]);

  // const filteredEntries = entries.filter((entry) => {
  //   if (showFollowingOnly && !following.includes(entry.userId)) {
  //     return false;
  //   }
  //   if (moodFilter !== "all" && entry.mood !== moodFilter) {
  //     return false;
  //   }
  //   if (
  //     genreFilter !== "all" &&
  //     entry.songRecommendation?.genre !== genreFilter
  //   ) {
  //     return false;
  //   }
  //   return !entry.isPrivate || entry.userId === user?.id;
  // });

  // const handlePlayToggle = (
  //   entryId: string,
  //   previewUrl: string | undefined
  // ) => {
  //   if (!previewUrl) return;

  //   if (playingAudio[entryId]) {
  //     if (isPlaying[entryId]) {
  //       playingAudio[entryId].pause();
  //     } else {
  //       playingAudio[entryId].play();
  //     }
  //     setIsPlaying({ ...isPlaying, [entryId]: !isPlaying[entryId] });
  //   } else {
  //     Object.keys(playingAudio).forEach((key) => playingAudio[key].pause());
  //     setIsPlaying(
  //       Object.keys(isPlaying).reduce(
  //         (acc, key) => ({ ...acc, [key]: false }),
  //         {}
  //       )
  //     );

  //     const audio = new Audio(previewUrl);
  //     audio.addEventListener("ended", () => {
  //       setIsPlaying((prev) => ({ ...prev, [entryId]: false }));
  //     });
  //     audio.play();
  //     setPlayingAudio({ ...playingAudio, [entryId]: audio });
  //     setIsPlaying({ ...isPlaying, [entryId]: true });
  //   }
  // };

  // const handleComment = async (entryId: string) => {
  //   if (!user || !commentText[entryId]?.trim()) return;

  //   try {
  //     await axios.post(
  //       `/api/entries/${entryId}/comment`,
  //       { content: commentText[entryId] },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  //         },
  //       }
  //     );
  //     setCommentText({ ...commentText, [entryId]: "" });
  //   } catch (error) {
  //     console.error("Error adding comment:", error);
  //   }
  // };

  const filteredEntries = entries.filter((entry) => {
    if (moodFilter !== "all" && entry.moodAnalysis !== moodFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search and Filter Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Users */}
          <div className="relative flex-1">
            <div className="flex items-center bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
              <Search className="h-5 w-5 text-gray-400 ml-2" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-transparent focus:outline-none text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-4">
            <select
              value={moodFilter}
              onChange={(e) => setMoodFilter(e.target.value)}
              className="px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-0"
            >
              <option value="all">All Moods</option>
              <option value="happy">Happy</option>
              <option value="relaxed">Relaxed</option>
              <option value="energetic">Energetic</option>
              <option value="melancholic">Melancholic</option>
            </select>
            <select
              value={genreFilter}
              onChange={(e) => setGenreFilter(e.target.value)}
              className="px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-0"
            >
              <option value="all">All Genres</option>
              <option value="Rock">Rock</option>
              <option value="Pop">Pop</option>
              <option value="Jazz">Jazz</option>
              <option value="Classical">Classical</option>
            </select>
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

      {/* Feed Entries */}
      {/* <div className="space-y-6">
        {entries.length > 0 ? (
          entries.map((entry) => (
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
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-full text-sm font-medium capitalize">
                  {entry.moodAnalysis}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {entry.userInput}
              </p>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between"></div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {entry.suggestedSong.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {entry.suggestedSong.artist}
                </p>
              </div>

              
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-400">
            No moods shared yet.
          </p>
        )}
      </div> */}

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
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-full text-sm font-medium capitalize">
                  {entry.moodAnalysis}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {entry.userInput}
              </p>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {entry.suggestedSong.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {entry.suggestedSong.artist}
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
