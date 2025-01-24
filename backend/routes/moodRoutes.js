import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/analyze", async (req, res) => {
  try {
    const { userInput } = req.body;

    const prompt = `
      Analyze the following user input and provide a JSON response. 
      Format the response as follows: 
      {
        "mood": "<detected mood>",
        "songRecommendation": {
          "title": "<song title>",
          "artist": "<song artist>"
        }
      }

      User input: "${userInput}"
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that outputs JSON.",
        },
        { role: "user", content: prompt },
      ],
    });

    // Attempt to parse AI response as JSON
    const aiResponse = JSON.parse(response.choices[0].message.content.trim());

    res.json({
      mood: aiResponse.mood,
      songRecommendation: aiResponse.songRecommendation || {
        title: "Unknown Title",
        artist: "Unknown Artist",
      },
    });
  } catch (error) {
    console.error("Error with OpenAI API:", error);
    res.status(500).json({ error: "Failed to analyze mood" });
  }
});

export default router;
