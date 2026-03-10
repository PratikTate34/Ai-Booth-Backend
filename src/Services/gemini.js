import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: "PASTE_YOUR_GEMINI_KEY"
});

export const generateImage = async (base64, character) => {
  const prompt = `
Create ultra realistic professional ${character} portrait.
Keep same face.
Corporate lighting.
HD quality.
`;

  const res = await ai.models.generateContent({
    model: "gemini-2.0-flash-exp",
    contents: [
      { role: "user", parts: [{ text: prompt }] },
      {
        role: "user",
        parts: [
          {
            inlineData: {
              mimeType: "image/png",
              data: base64.split(",")[1],
            },
          },
        ],
      },
    ],
  });

  return res?.candidates?.[0]?.content?.parts?.[0]?.text;
};
