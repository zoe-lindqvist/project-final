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
  const [content, setContent] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const addEntry = useMoodStore((state) => state.addEntry);
  const navigate = useNavigate();

  const analyzeMood = useMoodStore((state) => state.analyzeMood);
  const moodSuggestion = useMoodStore((state) => state.moodSuggestion);
  const songSuggestion = useMoodStore((state) => state.songSuggestion);
  const analyzing = useMoodStore((state) => state.analyzing);

  console.log("Current Mood Suggestion:", moodSuggestion);
  console.log("Current Song Suggestion:", songSuggestion);

  const analyzeContent = async () => {
    if (!content.trim() || analyzing) return; // Prevent duplicate calls during loading
    await analyzeMood(content);
  };

  const handleSave = () => {
    const user = useAuthStore.getState().user;
    if (!user || !moodSuggestion || !songSuggestion) return;

    addEntry({
      content,
      mood: moodSuggestion as Mood,
      isPrivate: true,
      userId: user.id,
      userName: user.name,
      songRecommendation: {
        title: songSuggestion.title || "Unknown",
        artist: songSuggestion.artist || "Unknown",
        genre: songSuggestion.genre || "Unknown",
        spotifyUrl: songSuggestion.spotifyUrl || "#",
      },
    });

    // Reset form
    setContent("");
    useMoodStore.setState({ moodSuggestion: null, songSuggestion: null });
    navigate("/profile");
  };

  const togglePlay = () => {
    if (!songSuggestion?.previewUrl) return;

    if (!audio) {
      const newAudio = new Audio(songSuggestion.previewUrl);
      newAudio.addEventListener("ended", () => setIsPlaying(false));
      setAudio(newAudio);
      newAudio.play();
      setIsPlaying(true);
    } else {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleShareToFeed = async () => {
    if (!content.trim() || !moodSuggestion || !songSuggestion) {
      alert("Please analyze your mood before sharing.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/moods/add",
        {
          userInput: content,
          moodAnalysis: moodSuggestion,
          suggestedSong: {
            title: songSuggestion.title,
            artist: songSuggestion.artist,
            genre: songSuggestion.genre,
            spotifyLink: songSuggestion.spotifyUrl,
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
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
        <div className="flex items-center space-x-3 mb-6">
          <PenLine className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            How are you feeling?
          </h1>
        </div>

        <TextareaAutosize
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Express your thoughts and feelings..."
          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent resize-none"
          minRows={4}
        />

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
                  <button
                    onClick={togglePlay}
                    className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                  >
                    <Music2 className="h-6 w-6" />
                  </button>
                </div>

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

// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import TextareaAutosize from "react-textarea-autosize";
// import {
//   PenLine,
//   Loader2,
//   Music2,
//   RefreshCcw,
//   Share2,
//   Check,
//   Sparkles,
// } from "lucide-react";
// import { useMoodStore } from "../store/moodStore";
// import { useAuthStore } from "../store/useAuthStore";
// import { Mood } from "../types";

// export const Journal: React.FC = () => {
//   const [content, setContent] = useState("");
//   const [isAnalyzing, setIsAnalyzing] = useState(false);
//   const [analyzedMood, setAnalyzedMood] = useState<string | null>(null);
//   const [songRecommendation, setSongRecommendation] = useState<{
//     title: string;
//     artist: string;
//     genre: string;
//     spotifyUrl: string;
//     previewUrl: string | null;
//   } | null>(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
//   const addEntry = useMoodStore((state) => state.addEntry);
//   const navigate = useNavigate();

//   const { analyzeMood, moodSuggestion, songSuggestion, analyzing } =
//     useMoodStore();

//   console.log("Current Mood Suggestion:", moodSuggestion);
//   console.log("Current Song Suggestion:", songSuggestion);

//   const analyzeContent = async () => {
//     if (!content.trim()) return;

//     setIsAnalyzing(true);
//     try {
//       await analyzeMood(content);
//     } catch (error) {
//       console.error("Error analyzing content:", error);
//     } finally {
//       setIsAnalyzing(false);
//     }
//   };

//   // const analyzeContent = async () => {
//   //   if (!content.trim()) return;

//   //   setIsAnalyzing(true);
//   //   setAnalyzedMood(null);
//   //   setSongRecommendation(null);

//   //   try {
//   //     // Simulated AI analysis and song recommendation
//   //     await new Promise((resolve) => setTimeout(resolve, 1500));

//   //     // Mock response - in production, this would come from your AI service
//   //     const mockMoods = [
//   //       "energetic",
//   //       "relaxed",
//   //       "happy",
//   //       "contemplative",
//   //       "melancholic",
//   //     ];
//   //     const randomMood =
//   //       mockMoods[Math.floor(Math.random() * mockMoods.length)];
//   //     setAnalyzedMood(randomMood);

//   //     // Mock song recommendation - in production, this would come from Spotify API
//   //     const mockSongs = [
//   //       {
//   //         title: "Don't Stop Believin'",
//   //         artist: "Journey",
//   //         genre: "Rock",
//   //         spotifyUrl: "https://open.spotify.com/track/4bHsxqR3GMrXTxEPLuK5ue",
//   //         previewUrl:
//   //           "https://p.scdn.co/mp3-preview/4f110e6aa9a7b6c9c71e2f5a9a4d8c48d4c764ed",
//   //       },
//   //       {
//   //         title: "Bohemian Rhapsody",
//   //         artist: "Queen",
//   //         genre: "Rock",
//   //         spotifyUrl: "https://open.spotify.com/track/3z8h0TU7ReDPLIbEnYhWZb",
//   //         previewUrl:
//   //           "https://p.scdn.co/mp3-preview/d4e0487e565d3c89f0c66bb5f8c6c3d9ddb4112b",
//   //       },
//   //     ];
//   //     setSongRecommendation(
//   //       mockSongs[Math.floor(Math.random() * mockSongs.length)]
//   //     );
//   //   } catch (error) {
//   //     console.error("Error analyzing content:", error);
//   //   } finally {
//   //     setIsAnalyzing(false);
//   //   }
//   // };

//   const handleSave = () => {
//     const user = useAuthStore.getState().user; // Retrieve user from useAuthStore
//     if (!user || !moodSuggestion || !songSuggestion) return;

//     addEntry({
//       content,
//       mood: moodSuggestion as Mood,
//       isPrivate: true,
//       userId: user.id,
//       userName: user.name,
//       songRecommendation: {
//         title: songSuggestion.title,
//         artist: songSuggestion.artist,
//         genre: songSuggestion.genre,
//         spotifyUrl: songSuggestion.spotifyUrl,
//       },
//     });

//     // Reset form
//     setContent("");
//     setAnalyzedMood(null);
//     setSongRecommendation(null);

//     // Navigate to profile to see the entry
//     navigate("/profile");
//   };

//   const togglePlay = () => {
//     if (!songRecommendation?.previewUrl) return;

//     if (!audio) {
//       const newAudio = new Audio(songRecommendation.previewUrl);
//       newAudio.addEventListener("ended", () => setIsPlaying(false));
//       setAudio(newAudio);
//       newAudio.play();
//       setIsPlaying(true);
//     } else {
//       if (isPlaying) {
//         audio.pause();
//       } else {
//         audio.play();
//       }
//       setIsPlaying(!isPlaying);
//     }
//   };

//   const shareToFeed = () => {
//     const user = useAuthStore.getState().user; // Retrieve user from useAuthStore
//     if (!user || !analyzedMood || !songRecommendation) return; // Check if user exists

//     addEntry({
//       content,
//       mood: analyzedMood as Mood, // Ensure `Mood` type matches
//       isPrivate: false,
//       userId: user.id, // Add userId
//       userName: user.name, // Add userName
//       songRecommendation: {
//         title: songRecommendation.title,
//         artist: songRecommendation.artist,
//         genre: songRecommendation.genre,
//         spotifyUrl: songRecommendation.spotifyUrl,
//       },
//     });

//     // Reset form and navigate to feed
//     setContent("");
//     navigate("/feed");
//   };

//   return (
//     <div className="container mx-auto px-4 py-8 max-w-3xl">
//       <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
//         <div className="flex items-center space-x-3 mb-6">
//           <PenLine className="h-6 w-6 text-purple-600 dark:text-purple-400" />
//           <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
//             How are you feeling?
//           </h1>
//         </div>

//         <TextareaAutosize
//           value={content}
//           onChange={(e) => setContent(e.target.value)}
//           placeholder="Express your thoughts and feelings..."
//           className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent resize-none"
//           minRows={4}
//         />

//         <div className="mt-4 flex justify-end">
//           <button
//             onClick={analyzeContent}
//             disabled={!content.trim() || isAnalyzing}
//             className="inline-flex items-center space-x-2 bg-purple-600 dark:bg-purple-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-purple-700 dark:hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {isAnalyzing ? (
//               <>
//                 <Loader2 className="h-5 w-5 animate-spin" />
//                 <span>Analyzing...</span>
//               </>
//             ) : (
//               <>
//                 <Sparkles className="h-5 w-5" />
//                 <span>Analyze Mood</span>
//               </>
//             )}
//           </button>
//         </div>

//         {moodSuggestion && (
//           <div className="mt-8 space-y-6">
//             <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
//               <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
//                 Your Mood Analysis
//               </h2>
//               <p className="text-purple-600 dark:text-purple-400 text-2xl font-bold capitalize">
//                 {moodSuggestion}
//               </p>
//             </div>

//             {songSuggestion && (
//               <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
//                 <div className="flex items-start justify-between">
//                   <div>
//                     <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
//                       Recommended Song
//                     </h2>
//                     <div className="space-y-1">
//                       <p className="text-xl font-semibold text-gray-900 dark:text-white">
//                         {songSuggestion.title}
//                       </p>
//                       <p className="text-gray-600 dark:text-gray-300">
//                         {songSuggestion.artist}
//                       </p>
//                       {/* <p className="text-sm text-gray-500 dark:text-gray-400">
//                         {songSuggestion.genre}
//                       </p> */}
//                     </div>
//                   </div>
//                   <button
//                     onClick={togglePlay}
//                     className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
//                   >
//                     <Music2 className="h-6 w-6" />
//                   </button>
//                 </div>

//                 <div className="mt-6 flex items-center space-x-4">
//                   <button
//                     onClick={analyzeContent}
//                     className="inline-flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
//                   >
//                     <RefreshCcw className="h-4 w-4" />
//                     <span>Try Another Song</span>
//                   </button>
//                   <button
//                     onClick={handleSave}
//                     className="inline-flex items-center space-x-2 bg-purple-600 dark:bg-purple-500 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors"
//                   >
//                     <Check className="h-4 w-4" />
//                     <span>Save Entry</span>
//                   </button>
//                   <button
//                     onClick={shareToFeed}
//                     className="inline-flex items-center space-x-2 bg-blue-600 dark:bg-blue-500 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
//                   >
//                     <Share2 className="h-4 w-4" />
//                     <span>Share to Feed</span>
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };
