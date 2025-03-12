/**
 * **Journal Page**
 *
 * Enables users to write journal entries, analyze their mood, and get music recommendations.
 *
 * **Features:**
 * - **Mood Analysis**: AI evaluates journal entries and suggests a mood.
 * - **Music Recommendations**: Provides mood-matching song suggestions.
 * - **Saving & Sharing**: Entries can be saved or shared with the community.
 *
 * **Accessibility Enhancements:**
 * - Uses `aria-labelledby` and `role="region"` for better screen reader navigation.
 * - `aria-live="polite"` announces mood analysis results dynamically.
 * - Buttons include `aria-label` and `aria-disabled` for improved usability.
 *
 * **Responsive UI:**
 * - Styled with Tailwind CSS, supporting both desktop and mobile layouts.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize"; // Auto fixar höjden på textarea
import {
  Play,
  PenLine,
  Loader2,
  RefreshCcw,
  Share2,
  Check,
  Sparkles,
} from "lucide-react";
import axios from "axios"; // Gör HTTP-förfrågningar
import { useMoodStore } from "../store/moodStore";
import { useAuthStore } from "../store/useAuthStore";
import { mapToCategory } from "../utils/moodUtils";
import { triggerConfetti } from "../utils/confetti";

export const Journal: React.FC = () => {
  // useState för att lagra användarinmatning i textfältet
  const [content, setContent] = useState(""); // initierar state med en tom sträng

  // API_BASE_URL från env, localhost om den saknas
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

  const navigate = useNavigate(); // Hook för att navigera till olika sidor

  // Hämtar funktionen från store
  const analyzeMood = useMoodStore((state) => state.analyzeMood);
  // Lagrar AI:s förslag på vilket humör användaren har
  const moodSuggestion = useMoodStore((state) => state.moodSuggestion);
  // Lagrar AI:s förslag på en låt som matchar humöret
  const songSuggestion = useMoodStore((state) => state.songSuggestion);
  // En boolean som indikerar om analysen pågår just nu
  const analyzing = useMoodStore((state) => state.analyzing);
  // Hämtar inloggad användares data från useAuthStore
  const user = useAuthStore((state) => state.user);
  // Om en användare är inloggad visas deras username, annars visas "friend"
  const username = user ? user.username : "friend";

  // Funktion för att analysera humöret
  const handleAnalyze = async () => {
    await analyzeMood(content); // Anropar funktionen från store
  };

  // Funktion för att spara journal innput till backend
  const handleSave = async () => {
    const user = useAuthStore.getState().user; // Hämtar den inloggade användaren
    // Om saknas, visa alert, avbryt funktionen
    if (!user || !moodSuggestion || !songSuggestion) {
      alert("Failed to save the mood.");
      return;
    }

    // Försöker skicka en HTTP POST-förfrågan till backend med användarens inmatning
    try {
      // await pausas här tills axios.post har fått ett svar från servern
      const response = await axios.post(
        `${API_BASE_URL}/api/moods/save`, // Backend-endpoint
        {
          userInput: content,
          moodAnalysis: moodSuggestion,
          category: mapToCategory(moodSuggestion),
          shared: false, // Inlägget är privat
          suggestedSong: {
            title: songSuggestion.title || "Unknown",
            artist: songSuggestion.artist || "Unknown",
            genre: songSuggestion.genre || "Unknown",
            spotifyLink: songSuggestion.spotifyUrl || "#",
          },
        },
        {
          headers: {
            // Skickar med användarens inloggnings-token i Authorization-header
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      // Om sparningen lyckas
      if (response.status === 201) {
        setContent(""); // Rensa inmatningsfältet efter sparning
        useMoodStore.getState().saveMoodEntry(response.data.mood); // Sparas i store
        // Konfetti-effekt
        triggerConfetti();
        // Skickar användaren till deras profil
        navigate("/profile");
      }
      // Om något går fel
    } catch (error) {
      console.error("Error saving mood:", error);
      alert("Failed to save mood.");
    }
  };

  //Funktion för att dela journal entry/anteckningen till feed
  const handleShareToFeed = async () => {
    // Om saknas, visa alert, avbryt funktionen
    if (!content.trim() || !moodSuggestion || !songSuggestion) {
      alert("Please analyze your mood before sharing.");
      return;
    }
    // Försöker skicka en HTTP POST-förfrågan till backend med användarens inmatning
    try {
      // await pausas här tills axios.post har fått ett svar från servern
      const response = await axios.post(
        `${API_BASE_URL}/api/moods/share`,
        {
          userInput: content,
          moodAnalysis: moodSuggestion,
          category: mapToCategory(moodSuggestion),
          shared: true,
          suggestedSong: {
            title: songSuggestion.title,
            artist: songSuggestion.artist,
            genre: songSuggestion.genre,
            spotifyLink: songSuggestion.spotifyUrl || "#",
          },
        },
        {
          headers: {
            // Skickar med användarens inloggnings-token i Authorization-header
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response.status === 201) {
        setContent(""); // Rensar textfältet efter delning
      }
      // Konfetti-effekt
      triggerConfetti();
      const sharedMoodEntry = response.data;
      // Sparar inlägget i Store och skickar användaren till feed
      useMoodStore.getState().saveMoodEntry(sharedMoodEntry);
      navigate("/feed");
      // Om något går fel
    } catch (error) {
      console.error("Error sharing mood:", error);
      alert("Failed to share mood.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-2 md:px-4 lg:px-6 py-8">
      {" "}
      {/* Rubrik */}
      <div className="text-center mb-8">
        <h1
          id="journal-title" // Används för att referera till rubriken i ARIA
          className="text-3xl font-bold text-gray-900 dark:text-white"
        >
          Your Mood Journal
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Express your feelings and discover music that matches your mood
        </p>
      </div>
      {/* Journalsektion - Huvudcontainer */}
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8"
        role="region" // Markerar detta som en viktig sektion för skärmläsare
        aria-labelledby="journal-entry-heading" // Kopplar sektionen till rubriken för bättre tillgänglighet
      >
        {/* Rubrik och ikon */}
        <div className="flex items-center space-x-3 mb-6">
          <PenLine className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          <h2
            id="journal-entry-heading"
            className="text-2xl font-bold text-gray-900 dark:text-white"
            tabIndex={0} // Makes it focusable for keyboard users
          >
            Hi, {username}! How are you feeling?
          </h2>
        </div>

        {/* Textfält där användaren skriver sin journal */}
        <TextareaAutosize
          value={content}
          onChange={(e) => setContent(e.target.value)} // Uppdaterar state när användaren skriver
          placeholder="Write your thoughts or feelings..."
          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent resize-none"
          minRows={4} // Gör att textfältet börjar med minst 4 rader
          aria-label="Journal Entry" // Används för att beskriva textfältet för skärmläsare
          aria-required="true" // Markerar fältet som obligatoriskt
        />

        {/* Analyze Mood Knapp */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleAnalyze} // Kör vid klick
            disabled={!content.trim() || analyzing} // Inaktiverar knappen om fältet är tomt eller analysen pågår
            className="inline-flex items-center space-x-2 bg-purple-600 dark:bg-purple-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-purple-700 dark:hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Analyze Mood"
            aria-disabled={analyzing}
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

        {/* Mood Suggestion om en analys har gjorts*/}
        {moodSuggestion && (
          <div
            className="mt-8 space-y-6"
            role="region" // Markerar detta som en egen sektion för skärmläsare
            aria-labelledby="mood-analysis-heading" // Kopplar sektionen till rubriken
            aria-live="polite" // Skärmläsare meddelar innehållsförändringar
          >
            <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <h2
                id="mood-analysis-heading"
                className="text-lg font-semibold text-gray-900 dark:text-white mb-2"
              >
                Your Mood Analysis
              </h2>
              <p className="text-purple-600 dark:text-purple-400 text-2xl font-bold capitalize">
                {moodSuggestion}
              </p>
            </div>
            {/* Song Suggestion om en analys har gjorts*/}
            {songSuggestion && (
              <div
                className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                role="region"
                aria-labelledby="song-suggestion-heading"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h2
                      id="song-suggestion-heading"
                      className="text-lg font-semibold text-gray-900 dark:text-white mb-4"
                    >
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

                {/* Spotify inbäddad spelare */}
                {songSuggestion.spotifyUrl && (
                  <div className="w-full mt-8 -mb-6 flex justify-start">
                    <iframe
                      src={`https://open.spotify.com/embed/track/${songSuggestion.spotifyUrl
                        .split("/")
                        .pop()}`} // Extraherar spår-ID från Spotify-länken
                      className="w-full max-w-full h-28 sm:w-1/2 sm:h-44 md:w-1/2 md:h-48 lg:w-1/2 lg:h-52 rounded-lg"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy" // Förbättrar prestanda genom att ladda in spelaren först när den behövs
                      title="Spotify Player"
                    ></iframe>
                  </div>
                )}

                {/* Action Knappar */}
                <div className="mt-6 flex justify-center gap-4 flex-wrap w-full">
                  {/* Try Again Knapp */}
                  <button
                    onClick={handleAnalyze}
                    className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 transition-transform transform hover:scale-105 rounded-full text-white px-4 sm:px-6 py-2 text-sm font-semibold shadow-md"
                  >
                    <RefreshCcw className="h-4 w-4" />
                    <span>Try Again</span>
                  </button>

                  {/* Save Knapp */}
                  <button
                    onClick={handleSave}
                    className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 transition-transform transform hover:scale-105 rounded-full text-white px-4 sm:px-6 py-2 text-sm font-semibold shadow-md"
                  >
                    <Check className="h-4 w-4" />
                    <span>Save</span>
                  </button>

                  {/* Spotify Link */}
                  <a
                    href={songSuggestion.spotifyUrl} // Länk till låten på Spotify
                    target="_blank" // Öppnar länken i en ny flik
                    rel="noopener noreferrer" // Säkerhetsinställningar för att skydda användardata
                    className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 transition-transform transform hover:scale-105 rounded-full text-white px-4 sm:px-6 py-2 text-sm font-semibold shadow-md"
                  >
                    <Play className="h-4 w-4" />
                    <span>Spotify</span>
                  </a>

                  {/* Share Knapp */}
                  <button
                    onClick={handleShareToFeed}
                    className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 transition-transform transform hover:scale-105 rounded-full text-white px-4 sm:px-6 py-2 text-sm font-semibold shadow-md"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>Share</span>
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
