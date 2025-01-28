import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize";
import {
  PenLine,
  Loader2,
  Music2,
  RefreshCcw,
  Share2,
  Check,
  Sparkles,
} from "lucide-react";
import axios from "axios";
import { useMoodStore } from "../store/moodStore";
import { useAuthStore } from "../store/useAuthStore";
import { Mood } from "../types";

export const Journal: React.FC = () => {
  // State to store user input in the textarea
  const [content, setContent] = useState("");

  // const [isPlaying, setIsPlaying] = useState(false);
  // const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const saveMoodEntry = useMoodStore((state) => state.saveMoodEntry);

  // Dev branch
  // const addEntry = useMoodStore((state) => state.addEntry);

  const navigate = useNavigate();

  // Zustand store functions for analyzing mood and fetching suggestions
  const analyzeMood = useMoodStore((state) => state.analyzeMood);
  const moodSuggestion = useMoodStore((state) => state.moodSuggestion);
  const songSuggestion = useMoodStore((state) => state.songSuggestion);
  const analyzing = useMoodStore((state) => state.analyzing);

  // Function to analyze user's input
  const analyzeContent = async () => {
    if (!content.trim() || analyzing) return; // Prevent empty input or duplicate requests
    await analyzeMood(content);
  };

  const handleSave = async () => {
    // Function to save the journal entry to the store

    const user = useAuthStore.getState().user;
    if (!user || !moodSuggestion || !songSuggestion) {
      alert("Please analyze your mood before saving.");
      return;
    }

    await useMoodStore.getState().saveMoodEntry({
      userId: user.id,
      userInput: content,
      moodAnalysis: moodSuggestion,
      mood: moodSuggestion,
      content: content,

      shared: false,

      suggestedSong: {
        title: songSuggestion.title || "Unknown",
        artist: songSuggestion.artist || "Unknown",
        genre: songSuggestion.genre || "Unknown",
        spotifyUrl: songSuggestion.spotifyUrl || "#",
      },
    });

    // Reset form after saving
    setContent("");
    useMoodStore.setState({ moodSuggestion: null, songSuggestion: null });
    navigate("/profile");
  };

  // const togglePlay = () => {
  //   if (!songSuggestion?.previewUrl) return;

  //   if (!audio) {
  //     const newAudio = new Audio(songSuggestion.previewUrl);
  //     newAudio.addEventListener("ended", () => setIsPlaying(false));
  //     setAudio(newAudio);
  //     newAudio.play();
  //     setIsPlaying(true);
  //   } else {
  //     if (isPlaying) {
  //       audio.pause();
  //     } else {
  //       audio.play();
  //     }
  //     setIsPlaying(!isPlaying);
  //   }
  // };

  const handleShareToFeed = async () => {
    if (!content.trim() || !moodSuggestion || !songSuggestion) {
      alert("Please analyze your mood before sharing.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/moods/share",
        {
          userInput: content,
          moodAnalysis: moodSuggestion,
          suggestedSong: {
            title: songSuggestion.title,
            artist: songSuggestion.artist,
            genre: songSuggestion.genre,
            spotifyLink: songSuggestion.spotifyUrl || "#",
          },
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response.status === 201) {
        alert("Mood shared successfully!");
        setContent(""); // Clear input after sharing
      }
    } catch (error) {
      console.error("Error sharing mood:", error);
      alert("Failed to share mood.");
    }

    navigate("/feed");

    // Dev branch
    //     // Reset input and state after saving
    //     setContent("");
    //     useMoodStore.setState({ moodSuggestion: null, songSuggestion: null });
    //     navigate("/profile"); // Redirect to profile page
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
        {/* Header Section */}
        <div className="flex items-center space-x-3 mb-6">
          <PenLine className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            How are you feeling?
          </h1>
        </div>

        {/* Textarea for user input */}
        <TextareaAutosize
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Express your thoughts and feelings..."
          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent resize-none"
          minRows={4}
        />

        {/* Analyze Mood Button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={analyzeContent}
            disabled={!content.trim() || analyzing}
            className="inline-flex items-center space-x-2 bg-purple-600 dark:bg-purple-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-purple-700 dark:hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {analyzing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                <span>Analyze Mood</span>
              </>
            )}
          </button>
        </div>

        {/* Mood and Song Suggestions */}
        {moodSuggestion && (
          <div className="mt-8 space-y-6">
            <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Your Mood Analysis
              </h2>
              <p className="text-purple-600 dark:text-purple-400 text-2xl font-bold capitalize">
                {moodSuggestion}
              </p>
            </div>

            {songSuggestion && (
              <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Recommended Song
                    </h2>
                    <div className="space-y-1">
                      <p className="text-xl font-semibold text-gray-900 dark:text-white">
                        {songSuggestion.title}
                      </p>
                      <p className="text-gray-600 dark:text-gray-300">
                        {songSuggestion.artist}
                      </p>
                      {songSuggestion.genre && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {songSuggestion.genre}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Spotify Embedded Player */}
                {songSuggestion.spotifyUrl && (
                  <div className="mt-6">
                    <iframe
                      src={`https://open.spotify.com/embed/track/${songSuggestion.spotifyUrl
                        .split("/")
                        .pop()}`}
                      className="w-full h-32 rounded-lg shadow-lg"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                    ></iframe>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-6 flex items-center space-x-4">
                  <button
                    onClick={analyzeContent}
                    className="inline-flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  >
                    <RefreshCcw className="h-4 w-4" />
                    <span>Try Another Song</span>
                  </button>

                  <button
                    onClick={handleSave}
                    className="inline-flex items-center space-x-2 bg-purple-600 dark:bg-purple-500 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors"
                  >
                    <Check className="h-4 w-4" />
                    <span>Save Entry</span>
                  </button>
                  <a
                    href={songSuggestion.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-green-500 hover:bg-green-400 transition-transform transform hover:scale-105 rounded-full text-white px-6 py-2 text-sm font-semibold shadow-md"
                  >
                    <Music2 className="h-4 w-4" />
                    <span>Listen on Spotify</span>
                  </a>

                  <button
                    onClick={handleShareToFeed}
                    className="inline-flex items-center space-x-2 bg-blue-600 dark:bg-blue-500 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>Share to Feed</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
