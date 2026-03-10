import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const generateAIImage = async (req, res) => {
  try {
    const prompt = req.body?.prompt;
    const file = req.file;

    if (!file || !prompt) {
      return res.status(400).json({ error: "Prompt or image missing" });
    }

    const base64 = file.buffer.toString("base64");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Transform this person into ${prompt}. Ultra realistic professional cinematic photo. Only return image.`,
            },
            {
              inlineData: {
                mimeType: file.mimetype,
                data: base64,
              },
            },
          ],
        },
      ],
      generationConfig: {
        responseModalities: ["IMAGE"],
      },
    });

    const parts = response?.candidates?.[0]?.content?.parts || [];
    let imageBase64 = null;

    for (const part of parts) {
      if (part.inlineData?.data) {
        imageBase64 = part.inlineData.data;
        break;
      }
    }

    if (!imageBase64) {
      return res.status(500).json({ error: "No image from AI" });
    }

    res.json({
      success: true,
      image: `data:image/png;base64,${imageBase64}`,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};