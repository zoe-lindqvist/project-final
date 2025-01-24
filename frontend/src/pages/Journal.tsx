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
import { useMoodStore } from "../store/moodStore";
import { useAuthStore } from "../store/useAuthStore";
import { Mood } from "../types";

export const Journal: React.FC = () => {
  const [content, setContent] = useState("");
  const addEntry = useMoodStore((state) => state.addEntry);
  const navigate = useNavigate();

  const analyzeMood = useMoodStore((state) => state.analyzeMood);
  const moodSuggestion = useMoodStore((state) => state.moodSuggestion);
  const songSuggestion = useMoodStore((state) => state.songSuggestion);
  const analyzing = useMoodStore((state) => state.analyzing);

  console.log("Current Mood Suggestion:", moodSuggestion);
  console.log("Current Song Suggestion:", songSuggestion);

  const analyzeContent = async () => {
    if (!content.trim() || analyzing) return;
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

    setContent("");
    useMoodStore.setState({ moodSuggestion: null, songSuggestion: null });
    navigate("/profile");
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
                </div>

                {/* Spotify Embedded Player */}
                {songSuggestion.spotifyUrl && (
                  <div className="mt-6">
                    <iframe
                      src={`https://open.spotify.com/embed/track/${songSuggestion.spotifyUrl
                        .split("/")
                        .pop()}`}
                      className="w-full h-32 rounded-lg shadow-lg"
                      frameBorder="0"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                    ></iframe>
                  </div>
                )}

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
                  <button className="inline-flex items-center space-x-2 bg-blue-600 dark:bg-blue-500 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
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
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
//   const addEntry = useMoodStore((state) => state.addEntry);
//   const navigate = useNavigate();

//   const analyzeMood = useMoodStore((state) => state.analyzeMood);
//   const moodSuggestion = useMoodStore((state) => state.moodSuggestion);
//   const songSuggestion = useMoodStore((state) => state.songSuggestion);
//   const analyzing = useMoodStore((state) => state.analyzing);

//   const analyzeContent = async () => {
//     if (!content.trim() || analyzing) return; // Prevent duplicate calls during loading
//     await analyzeMood(content);
//   };

//   const handleSave = () => {
//     const user = useAuthStore.getState().user;
//     if (!user || !moodSuggestion || !songSuggestion) return;

//     addEntry({
//       content,
//       mood: moodSuggestion as Mood,
//       isPrivate: true,
//       userId: user.id,
//       userName: user.name,
//       songRecommendation: {
//         title: songSuggestion.title || "Unknown",
//         artist: songSuggestion.artist || "Unknown",
//         genre: songSuggestion.genre || "Unknown",
//         spotifyUrl: songSuggestion.spotifyUrl || "#",
//       },
//     });

//     // Reset form
//     setContent("");
//     useMoodStore.setState({ moodSuggestion: null, songSuggestion: null });
//     navigate("/profile");
//   };

//   const togglePlay = () => {
//     if (!songSuggestion?.previewUrl) return;

//     if (!audio) {
//       const newAudio = new Audio(songSuggestion.previewUrl);
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
//             disabled={!content.trim() || analyzing}
//             className="inline-flex items-center space-x-2 bg-purple-600 dark:bg-purple-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-purple-700 dark:hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {analyzing ? (
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
//                       {songSuggestion.genre && (
//                         <p className="text-sm text-gray-500 dark:text-gray-400">
//                           {songSuggestion.genre}
//                         </p>
//                       )}
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
//                   <button className="inline-flex items-center space-x-2 bg-blue-600 dark:bg-blue-500 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
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
