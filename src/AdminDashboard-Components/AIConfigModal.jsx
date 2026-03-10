import React, { useEffect, useMemo, useState } from "react";

const AIConfigModal = ({
  initialPrompts = [],
  initialCharacters = [],
  onClose,
  onFinish,
}) => {
  const [prompts, setPrompts] = useState(initialPrompts);
  const [characters, setCharacters] = useState(initialCharacters);

  const [newPrompt, setNewPrompt] = useState("");
  const [newCharacterName, setNewCharacterName] = useState("");
  const [newCharacterImage, setNewCharacterImage] = useState(null);

  const [testImage, setTestImage] = useState(null);
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPreview, setGeneratedPreview] = useState(null);
  const [activeTab, setActiveTab] = useState("prompts");

  const newCharacterPreview = useMemo(() => {
    if (!newCharacterImage) return null;
    return URL.createObjectURL(newCharacterImage);
  }, [newCharacterImage]);

  useEffect(() => {
    return () => {
      if (newCharacterPreview) URL.revokeObjectURL(newCharacterPreview);
    };
  }, [newCharacterPreview]);

  const handleAddPrompt = () => {
    const trimmed = newPrompt.trim();
    if (trimmed && !prompts.includes(trimmed)) {
      setPrompts([...prompts, trimmed]);
      setNewPrompt("");
    }
  };

  const handleDeletePrompt = (index) => {
    const deleted = prompts[index];
    setPrompts(prompts.filter((_, i) => i !== index));
    if (selectedPrompt === deleted) setSelectedPrompt("");
  };

  const handleCharacterImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewCharacterImage(file);
  };

  const handleAddCharacter = () => {
    const trimmedName = newCharacterName.trim();
    if (!trimmedName || !newCharacterImage) return;

    const character = {
      id: crypto.randomUUID(),
      name: trimmedName,
      image: newCharacterPreview,
      file: newCharacterImage,
    };

    setCharacters((prev) => [...prev, character]);
    setNewCharacterName("");
    setNewCharacterImage(null);
  };

  const handleDeleteCharacter = (id) => {
    setCharacters((prev) => prev.filter((item) => item.id !== id));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const imageUrl = URL.createObjectURL(file);
    setTestImage(imageUrl);
  };

  const handleGeneratePreview = async () => {
    if (!testImage || !selectedPrompt) return;

    try {
      setIsGenerating(true);

      const res = await fetch(testImage);
      const blob = await res.blob();

      const formData = new FormData();
      formData.append("image", blob, "photo.jpg");
      formData.append("prompt", selectedPrompt.toString());

      const response = await fetch("http://localhost:5000/api/generate", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setGeneratedPreview(data.image);
      } else {
        alert(data.error || "AI failed");
      }
    } catch (err) {
      console.log(err);
      alert("Server error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFinish = () => {
    const cleanedCharacters = characters.map((char) => ({
      id: char.id,
      name: char.name,
      image: char.image,
    }));

    onFinish({
      prompts,
      characters: cleanedCharacters,
    });
  };

  const tabs = [
    {
      id: "prompts",
      label: "Prompts",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      id: "characters",
      label: "Characters",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5.121 17.804A4 4 0 017 17h10a4 4 0 011.879.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
    {
      id: "test",
      label: "AI Test",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-end sm:items-center justify-center sm:p-4">
      <div
        className="bg-white w-full sm:rounded-2xl shadow-2xl sm:max-w-7xl flex flex-col rounded-t-3xl"
        style={{ maxHeight: "calc(100dvh - env(safe-area-inset-top, 0px))" }}
      >
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-4 sm:px-8 py-4 sm:py-6 rounded-t-3xl sm:rounded-t-2xl flex-shrink-0">
          <div className="w-10 h-1 bg-white/30 rounded-full mx-auto mb-3 sm:hidden" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 7H7v6h6V7z" />
                  <path
                    fillRule="evenodd"
                    d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-sm sm:text-xl lg:text-2xl font-bold text-white">
                  AI Booth Configuration
                </h2>
                <p className="text-purple-100 text-xs sm:text-sm hidden sm:block mt-0.5">
                  Set up prompts, characters & test your AI booth
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex lg:hidden border-b border-slate-200 bg-white flex-shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                activeTab === tab.id
                  ? "text-purple-600 border-b-2 border-purple-600 bg-purple-50/60"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              <span className={activeTab === tab.id ? "text-purple-600" : "text-slate-400"}>
                {tab.icon}
              </span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="lg:grid lg:grid-cols-3 lg:gap-8 lg:items-start">
              {/* Prompts */}
              <div className={`${activeTab !== "prompts" ? "hidden lg:block" : "block"} space-y-4`}>
                <SectionHeading number="1" title="Prompt Management" />

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newPrompt}
                    onChange={(e) => setNewPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddPrompt())}
                    placeholder="e.g., cyberpunk portrait"
                    className="flex-1 min-w-0 px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleAddPrompt}
                    className="px-3 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-medium shadow-md shadow-purple-500/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-1 flex-shrink-0"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-2 max-h-56 sm:max-h-72 lg:max-h-[420px] overflow-y-auto pr-0.5">
                  {prompts.length === 0 ? (
                    <EmptyState text="No prompts added yet" sub="Type above and press Enter" />
                  ) : (
                    prompts.map((prompt, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-slate-50 rounded-xl border border-slate-200 hover:border-purple-300 transition-all group"
                      >
                        <NumberBadge n={index + 1} />
                        <p className="flex-1 text-slate-700 text-xs sm:text-sm font-medium line-clamp-2 min-w-0">
                          {prompt}
                        </p>
                        <button
                          type="button"
                          onClick={() => handleDeletePrompt(index)}
                          className="text-red-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-lg transition-all flex-shrink-0"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Characters */}
              <div className={`${activeTab !== "characters" ? "hidden lg:block" : "block"} space-y-4`}>
                <SectionHeading number="2" title="Character Management" />

                <div className="space-y-3">
                  <input
                    type="text"
                    value={newCharacterName}
                    onChange={(e) => setNewCharacterName(e.target.value)}
                    placeholder="Character name"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  />

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCharacterImageUpload}
                    className="hidden"
                    id="character-image-upload"
                  />

                  <label
                    htmlFor="character-image-upload"
                    className="block w-full border-2 border-dashed border-slate-300 rounded-xl hover:border-purple-400 transition-all cursor-pointer bg-slate-50 hover:bg-purple-50 overflow-hidden"
                  >
                    {newCharacterPreview ? (
                      <div className="h-36">
                        <img
                          src={newCharacterPreview}
                          alt="Character preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="py-6 text-center">
                        <p className="text-slate-600 text-sm font-medium">Upload Character Image</p>
                      </div>
                    )}
                  </label>

                  <button
                    type="button"
                    onClick={handleAddCharacter}
                    disabled={!newCharacterName.trim() || !newCharacterImage}
                    className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Character
                  </button>
                </div>

                <div className="space-y-2 max-h-56 sm:max-h-72 lg:max-h-[420px] overflow-y-auto pr-0.5">
                  {characters.length === 0 ? (
                    <EmptyState text="No characters added yet" sub="Add name and image" />
                  ) : (
                    characters.map((char, index) => (
                      <div
                        key={char.id || index}
                        className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200"
                      >
                        <img
                          src={char.image}
                          alt={char.name}
                          className="w-14 h-14 rounded-xl object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-slate-800 truncate">{char.name}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteCharacter(char.id)}
                          className="text-red-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-lg transition-all flex-shrink-0"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Test */}
              <div className={`${activeTab !== "test" ? "hidden lg:block" : "block"} space-y-4`}>
                <SectionHeading number="3" title="AI Test Area" />

                <div>
                  <Label>Upload Test Image</Label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="test-image-upload"
                  />
                  <label
                    htmlFor="test-image-upload"
                    className="block w-full border-2 border-dashed border-slate-300 rounded-xl hover:border-purple-400 active:border-purple-500 transition-all cursor-pointer bg-slate-50 hover:bg-purple-50 overflow-hidden"
                  >
                    {testImage ? (
                      <div className="relative">
                        <img src={testImage} alt="Test" className="w-full h-32 sm:h-70" />
                      </div>
                    ) : (
                      <div className="py-6 text-center">
                        <p className="text-slate-600 text-sm font-medium">Tap to upload test image</p>
                      </div>
                    )}
                  </label>
                </div>

                <div>
                  <Label>Select Prompt</Label>
                  <select
                    value={selectedPrompt}
                    onChange={(e) => setSelectedPrompt(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm bg-white"
                    disabled={prompts.length === 0}
                  >
                    <option value="">Choose a prompt...</option>
                    {prompts.map((prompt, i) => (
                      <option key={i} value={prompt}>
                        {prompt}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleGeneratePreview}
                  disabled={!testImage || !selectedPrompt || isGenerating}
                  className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-medium shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? "Generating..." : "Generate AI Preview"}
                </button>

                <div>
                  <Label>AI Output Preview</Label>
                  <div className="border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 flex items-center justify-center overflow-hidden min-h-[160px]">
                    {generatedPreview ? (
                      <img src={generatedPreview} alt="AI Generated" className="w-full h-32 sm:h-70" />
                    ) : (
                      <p className="text-slate-500 text-sm">
                        {isGenerating ? "Generating preview..." : "Preview will appear here"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="flex gap-3 px-4 sm:px-6 lg:px-8 py-4 border-t border-slate-200 bg-white sm:rounded-b-2xl flex-shrink-0"
          style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
        >
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 sm:py-3 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-all text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleFinish}
            disabled={prompts.length === 0}
            className="flex-[1] px-4 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-medium shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Finish Setup ({prompts.length} prompt{prompts.length !== 1 ? "s" : ""},{" "}
            {characters.length} character{characters.length !== 1 ? "s" : ""})
          </button>
        </div>
      </div>
    </div>
  );
};

const SectionHeading = ({ number, title }) => (
  <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
      <span className="text-purple-600 font-bold text-xs sm:text-sm">{number}</span>
    </div>
    {title}
  </h3>
);

const NumberBadge = ({ n }) => (
  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
    <span className="text-purple-600 font-bold text-xs">{n}</span>
  </div>
);

const Label = ({ children }) => (
  <label className="block text-sm font-semibold text-slate-700 mb-2">{children}</label>
);

const EmptyState = ({ text, sub }) => (
  <div className="text-center py-10 border-2 border-dashed border-slate-300 rounded-xl">
    <p className="text-slate-400 text-sm">{text}</p>
    {sub && <p className="text-slate-400 text-xs mt-1">{sub}</p>}
  </div>
);

export default AIConfigModal;