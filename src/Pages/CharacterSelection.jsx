import { useState } from "react";

const characters = [
  {
    id: 1,
    name: "Aria",
    image:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=Aria&backgroundColor=b6e3f4",
  },
  {
    id: 2,
    name: "Zara",
    image:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=Zara&backgroundColor=ffd5dc",
  },
  {
    id: 3,
    name: "Rex",
    image:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=Rex&backgroundColor=c0aede",
  },
  {
    id: 4,
    name: "Nova",
    image:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=Nova&backgroundColor=d1f7c4",
  },
];

const prompts = [
  "Cyberpunk style portrait",
  "Corporate magazine cover",
  "Futuristic AI hero",
  "Fantasy warrior character",
  "Professional headshot",
];

export default function CharacterPromptPage() {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [selectedPrompt, setSelectedPrompt] = useState(null);

  const selectCharacter = (char) => {
    setSelectedCharacter(char);
    setSelectedPrompt(null);
  };

  const selectPrompt = (prompt) => {
    setSelectedPrompt(prompt);
    setSelectedCharacter(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 flex justify-center">
      <div className="w-full max-w-3xl">

        
        <h1 className="text-xl font-bold text-slate-800 mb-6 text-center">
          Choose Character or Prompt
        </h1>

        
        <div className="grid grid-cols-4 gap-4 mb-8">

          {characters.map((char) => {
            const active = selectedCharacter?.id === char.id;

            return (
              <button
                key={char.id}
                onClick={() => selectCharacter(char)}
                className={`rounded-xl border p-2 transition 
                ${
                  active
                    ? "border-purple-500 shadow-md bg-purple-50"
                    : "border-slate-200 hover:border-purple-300"
                }`}
              >

                <img
                  src={char.image}
                  className="rounded-lg w-full aspect-square object-cover"
                />

                <p className="text-xs mt-2 font-medium text-slate-700">
                  {char.name}
                </p>
              </button>
            );
          })}
        </div>

        
        <div className="space-y-3">

          {prompts.map((prompt, index) => {
            const active = selectedPrompt === prompt;

            return (
              <button
                key={index}
                onClick={() => selectPrompt(prompt)}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition
                ${
                  active
                    ? "border-purple-500 bg-purple-50 shadow-sm"
                    : "border-slate-200 hover:border-purple-300 bg-white"
                }`}
              >

                <div className="w-8 h-8 rounded-md bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>

                <p className="text-sm text-slate-700">{prompt}</p>
              </button>
            );
          })}
        </div>

        
        <button
          disabled={!selectedCharacter && !selectedPrompt}
          className="mt-8 w-full bg-purple-600 text-white py-3 rounded-xl font-semibold disabled:opacity-40"
        >
          Continue
        </button>
      </div>
    </div>
  );
}