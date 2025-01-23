import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Music,
  Filter,
  Heart,
  MessageCircle,
  Share2,
  Play,
  Pause,
  User,
  Search,
} from "lucide-react";
import { useMoodStore } from "../store/moodStore";
import { useAuthStore } from "../store/useAuthStore";
import TextareaAutosize from "react-textarea-autosize";

export const Feed: React.FC = () => {
  const { user } = useAuthStore();
  const { entries, toggleLike, addComment } = useMoodStore();
  const { following, searchUsers } = useAuthStore();
  const [moodFilter, setMoodFilter] = useState<string>("all");
  const [genreFilter, setGenreFilter] = useState<string>("all");
  const [showFollowingOnly, setShowFollowingOnly] = useState(false);
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});
  const [playingAudio, setPlayingAudio] = useState<{
    [key: string]: HTMLAudioElement;
  }>({});
  const [isPlaying, setIsPlaying] = useState<{ [key: string]: boolean }>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  const searchResults = searchUsers(searchQuery);

  const filteredEntries = entries.filter((entry) => {
    if (showFollowingOnly && !following.includes(entry.userId)) {
      return false;
    }
    if (moodFilter !== "all" && entry.mood !== moodFilter) {
      return false;
    }
    if (
      genreFilter !== "all" &&
      entry.songRecommendation?.genre !== genreFilter
    ) {
      return false;
    }
    return !entry.isPrivate || entry.userId === user?.id;
  });

  const handlePlayToggle = (
    entryId: string,
    previewUrl: string | undefined
  ) => {
    if (!previewUrl) return;

    if (playingAudio[entryId]) {
      if (isPlaying[entryId]) {
        playingAudio[entryId].pause();
      } else {
        playingAudio[entryId].play();
      }
      setIsPlaying({ ...isPlaying, [entryId]: !isPlaying[entryId] });
    } else {
      // Stop any currently playing audio
      Object.keys(playingAudio).forEach((key) => playingAudio[key].pause());

      setIsPlaying(
        Object.keys(isPlaying).reduce(
          (acc, key) => ({ ...acc, [key]: false }),
          {}
        )
      );

      const audio = new Audio(previewUrl);
      audio.addEventListener("ended", () => {
        setIsPlaying((prev) => ({ ...prev, [entryId]: false }));
      });
      audio.play();
      setPlayingAudio({ ...playingAudio, [entryId]: audio });
      setIsPlaying({ ...isPlaying, [entryId]: true });
    }
  };

  const handleComment = (entryId: string) => {
    if (!user || !commentText[entryId]?.trim()) return;

    addComment(entryId, user.id, user.name, commentText[entryId]);
    setCommentText({ ...commentText, [entryId]: "" });
  };

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
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(true);
                }}
                className="w-full px-4 py-2 bg-transparent focus:outline-none text-gray-900 dark:text-white"
              />
            </div>

            {/* Search Results Dropdown */}
            {showSearchResults && searchQuery && (
              <div className="absolute w-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50">
                {searchResults.length > 0 ? (
                  searchResults.map((user) => (
                    <Link
                      key={user.id}
                      to={`/profile/${user.id}`}
                      className="flex items-center space-x-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => {
                        setSearchQuery("");
                        setShowSearchResults(false);
                      }}
                    >
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-full">
                        <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {user.name}
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

          {/* Feed Filters */}
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
      <div className="space-y-6">
        {filteredEntries.map((entry) => (
          <div
            key={entry.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <Link
                to={`/profile/${entry.userId}`}
                className="flex items-center space-x-3 group"
              >
                <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-full transform transition-transform group-hover:scale-110">
                  <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">
                    {entry.userName}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </Link>

              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-full text-sm font-medium capitalize">
                  {entry.mood}
                </span>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {entry.content}
            </p>

            {entry.songRecommendation && (
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {entry.songRecommendation.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {entry.songRecommendation.artist}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      handlePlayToggle(
                        entry.id,
                        entry.songRecommendation?.previewUrl
                      )
                    }
                    className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-full hover:bg-purple-200 dark:hover:bg-purple-800/50 transition-colors"
                  >
                    {isPlaying[entry.id] ? (
                      <Pause className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    ) : (
                      <Play className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    )}
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
              <button
                onClick={() => user && toggleLike(entry.id, user.id)}
                className={`flex items-center space-x-2 text-sm ${
                  user && entry.likes.includes(user.id)
                    ? "text-red-500"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                <Heart
                  className={`h-5 w-5 ${
                    user && entry.likes.includes(user.id) ? "fill-current" : ""
                  }`}
                />
                <span>{entry.likes.length}</span>
              </button>

              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <TextareaAutosize
                    value={commentText[entry.id] || ""}
                    onChange={(e) =>
                      setCommentText({
                        ...commentText,
                        [entry.id]: e.target.value,
                      })
                    }
                    placeholder="Add a comment..."
                    className="w-full min-h-[2.5rem] px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                  />
                  <button
                    onClick={() => handleComment(entry.id)}
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                  >
                    <MessageCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </button>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            {entry.comments.length > 0 && (
              <div className="mt-4 space-y-3">
                {entry.comments.map((comment) => (
                  <div key={comment.id} className="flex items-start space-x-3">
                    <div className="p-2 bg-gray-100 dark:bg-gray-700/50 rounded-full">
                      <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline space-x-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {comment.userName}
                        </h4>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
