export const genreCategories: Record<string, string[]> = {
  blues: [
    "blues",
    "delta blues",
    "chicago blues",
    "soul blues",
    "electric blues",
  ],
  classical: ["classical", "orchestral", "symphony", "baroque", "romantic"],
  country: ["country", "bluegrass", "folk", "americana"],
  dance: ["dance", "house", "techno", "trance", "dubstep", "edm"],
  electronic: ["electronic", "synthwave", "idm", "ambient", "chiptune"],
  funk: ["funk", "groove", "disco", "boogie"],
  hiphop: ["hip hop", "rap", "trap", "old school hip hop", "lofi hip hop"],
  indie: ["indie", "indie rock", "indie pop", "alt rock", "shoegaze"],
  jazz: ["jazz", "swing", "bebop", "fusion", "smooth jazz"],
  latin: ["latin", "salsa", "reggaeton", "bachata", "bossa nova"],
  metal: ["metal", "heavy metal", "death metal", "black metal", "thrash metal"],
  mixed: ["varied", "eclectic", "fusion", "mixed"], // Default category for unknown genres
  pop: ["pop", "dream pop", "synthpop", "k-pop", "bubblegum pop", "electropop"],
  reggae: ["reggae", "ska", "dancehall", "roots reggae"],
  rock: ["rock", "hard rock", "alternative rock", "punk", "classic rock"],
  soul: ["soul", "r&b", "neo soul", "contemporary r&b"],
};

export const mapToGenreCategory = (genre: string): string => {
  if (!genre) return "mixed"; // Default for missing or unknown genres

  for (const [mainGenre, subgenres] of Object.entries(genreCategories)) {
    if (subgenres.some((subgenre) => genre.toLowerCase().includes(subgenre))) {
      return mainGenre; // Return the first matching main genre
    }
  }

  return "mixed"; // Default if no match is found
};
