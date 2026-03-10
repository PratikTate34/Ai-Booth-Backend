import React, { useEffect, useMemo, useState } from "react";
import ActivityDropdown from "./ActivityDropdown";
import AIConfigModal from "./AIConfigModal";

const CreateEventModal = ({
  onClose,
  onCreateEvent,
  selectedEvent,
  isEditMode,
  onUpdateEvent,
}) => {
  const [formData, setFormData] = useState({
    eventName: "",
    companyName: "",
    location: "",
    eventDate: "",
    activities: [],
  });

  const [showAIConfig, setShowAIConfig] = useState(false);
  const [errors, setErrors] = useState({});
  const [companyLogo, setCompanyLogo] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);

  const normalizeActivities = (activities = []) => {
    const normalized = [];

    activities.forEach((activity) => {
      if (typeof activity === "string") {
        try {
          const parsed = JSON.parse(activity);

          if (Array.isArray(parsed)) {
            parsed.forEach((item) => {
              if (typeof item === "string") {
                normalized.push({
                  key: item,
                  config: {},
                });
              } else if (item?.key) {
                normalized.push({
                  key: item.key,
                  config: item.config || {},
                });
              }
            });
          } else if (parsed?.key) {
            normalized.push({
              key: parsed.key,
              config: parsed.config || {},
            });
          } else {
            normalized.push({
              key: activity,
              config: {},
            });
          }
        } catch {
          normalized.push({
            key: activity,
            config: {},
          });
        }
      } else if (activity?.key) {
        normalized.push({
          key: activity.key,
          config: activity.config || {},
        });
      }
    });

    const uniqueByKey = [];
    const seen = new Set();

    normalized.forEach((item) => {
      if (!item?.key) return;
      if (seen.has(item.key)) return;
      seen.add(item.key);
      uniqueByKey.push(item);
    });

    return uniqueByKey;
  };

  useEffect(() => {
    if (isEditMode && selectedEvent) {
      const normalizedActivities = normalizeActivities(selectedEvent.activities || []);

      setFormData({
        eventName: selectedEvent.eventName || "",
        companyName: selectedEvent.companyName || "",
        location: selectedEvent.location || "",
        eventDate: selectedEvent.eventDate
          ? new Date(selectedEvent.eventDate).toISOString().split("T")[0]
          : "",
        activities: normalizedActivities,
      });

      setCompanyLogo(selectedEvent.logo || null);
      setBackgroundImage(selectedEvent.backgroundImage || null);
    }
  }, [isEditMode, selectedEvent]);

  const logoPreview = useMemo(() => {
    if (!companyLogo) return null;
    return companyLogo instanceof File
      ? URL.createObjectURL(companyLogo)
      : `http://localhost:5000${companyLogo}`;
  }, [companyLogo]);

  const backgroundPreview = useMemo(() => {
    if (!backgroundImage) return null;
    return backgroundImage instanceof File
      ? URL.createObjectURL(backgroundImage)
      : `http://localhost:5000${backgroundImage}`;
  }, [backgroundImage]);

  useEffect(() => {
    return () => {
      if (companyLogo instanceof File && logoPreview) {
        URL.revokeObjectURL(logoPreview);
      }
      if (backgroundImage instanceof File && backgroundPreview) {
        URL.revokeObjectURL(backgroundPreview);
      }
    };
  }, [companyLogo, backgroundImage, logoPreview, backgroundPreview]);

  const selectedActivityKeys = formData.activities.map((item) => item.key);

  const aiActivity = formData.activities.find(
    (activity) => activity.key === "AI Photo Booth"
  );

  const aiPrompts = aiActivity?.config?.prompts || [];
  const aiCharacters = aiActivity?.config?.characters || [];

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCompanyLogo(file);
    }
  };

  const handleBackgroundUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setBackgroundImage(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleActivitiesChange = (activityNames) => {
    setFormData((prev) => {
      const normalizedActivities = activityNames.map((name) => {
        const existing = prev.activities.find((item) => item.key === name);
        if (existing) return existing;

        if (name === "AI Photo Booth") {
          return {
            key: name,
            config: {
              prompts: [],
              characters: [],
            },
          };
        }

        return {
          key: name,
          config: {},
        };
      });

      return {
        ...prev,
        activities: normalizedActivities,
      };
    });

    const hasAIPhotoBooth = activityNames.includes("AI Photo Booth");
    const hadAIPhotoBooth = formData.activities.some(
      (item) => item.key === "AI Photo Booth"
    );

    if (hasAIPhotoBooth && !hadAIPhotoBooth) {
      setShowAIConfig(true);
    }

    if (errors.activities) {
      setErrors((prev) => ({
        ...prev,
        activities: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.eventName.trim()) {
      newErrors.eventName = "Event name is required";
    }
    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }
    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }
    if (!formData.eventDate) {
      newErrors.eventDate = "Event date is required";
    }
    if (formData.activities.length === 0) {
      newErrors.activities = "Select at least one activity";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAIConfigFinish = ({ prompts = [], characters = [] }) => {
    setFormData((prev) => ({
      ...prev,
      activities: prev.activities.map((activity) =>
        activity.key === "AI Photo Booth"
          ? {
              ...activity,
              config: {
                ...activity.config,
                prompts,
                characters,
              },
            }
          : activity
      ),
    }));

    setShowAIConfig(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formPayload = new FormData();
    formPayload.append("eventName", formData.eventName);
    formPayload.append("companyName", formData.companyName);
    formPayload.append("location", formData.location);
    formPayload.append("eventDate", formData.eventDate);
    formPayload.append("activities", JSON.stringify(formData.activities));

    if (companyLogo && companyLogo instanceof File) {
      formPayload.append("logo", companyLogo);
    }

    if (backgroundImage && backgroundImage instanceof File) {
      formPayload.append("backgroundImage", backgroundImage);
    }

    try {
      let res;

      if (isEditMode) {
        res = await fetch(`http://localhost:5000/api/events/${selectedEvent._id}`, {
          method: "PUT",
          body: formPayload,
        });

        const data = await res.json();
        onUpdateEvent(data.event);
      } else {
        res = await fetch("http://localhost:5000/api/events/create", {
          method: "POST",
          body: formPayload,
        });

        const data = await res.json();
        onCreateEvent(data.event);
      }

      onClose();
    } catch (err) {
      console.log("Save error", err);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slideUp">
          <div className="sticky top-0 bg-white border-b border-slate-200 px-8 py-6 rounded-t-2xl z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {isEditMode ? "Edit Event" : "Create New Event"}
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Fill in the event details and select activities
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-100 rounded-lg"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
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

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Event Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="eventName"
                value={formData.eventName}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border ${
                  errors.eventName ? "border-red-300" : "border-slate-300"
                } rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                placeholder="Tech Conference 2026"
              />
              {errors.eventName && (
                <p className="text-red-500 text-sm mt-1">{errors.eventName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border ${
                  errors.companyName ? "border-red-300" : "border-slate-300"
                } rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                placeholder="Acme Corporation"
              />
              {errors.companyName && (
                <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border ${
                  errors.location ? "border-red-300" : "border-slate-300"
                } rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                placeholder="San Francisco, CA"
              />
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">{errors.location}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Event Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border ${
                  errors.eventDate ? "border-red-300" : "border-slate-300"
                } rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
              />
              {errors.eventDate && (
                <p className="text-red-500 text-sm mt-1">{errors.eventDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Activities <span className="text-red-500">*</span>
              </label>

              <ActivityDropdown
                selectedActivities={selectedActivityKeys}
                onChange={handleActivitiesChange}
              />

              {errors.activities && (
                <p className="text-red-500 text-sm mt-1">{errors.activities}</p>
              )}
            </div>

            <div className="space-y-4 sm:space-y-5 mt-6">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Branding
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Company Logo
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload"
                  />

                  <label
                    htmlFor="logo-upload"
                    className="block w-full border-2 border-dashed border-slate-300 rounded-xl hover:border-purple-400 transition-all cursor-pointer bg-slate-50 hover:bg-purple-50 overflow-hidden"
                  >
                    {logoPreview ? (
                      <div className="p-3 flex items-center gap-2">
                        <img
                          src={logoPreview}
                          alt="Logo"
                          className="w-12 h-12 object-contain rounded-lg bg-white p-1"
                        />
                        <span className="text-sm text-slate-700">Uploaded ✓</span>
                      </div>
                    ) : (
                      <div className="py-5 text-center">
                        <p className="text-slate-600 text-sm font-medium">
                          Upload Logo
                        </p>
                      </div>
                    )}
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Background Image
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBackgroundUpload}
                    className="hidden"
                    id="bg-upload"
                  />

                  <label
                    htmlFor="bg-upload"
                    className="block w-full border-2 border-dashed border-slate-300 rounded-xl hover:border-purple-400 transition-all cursor-pointer overflow-hidden"
                  >
                    {backgroundPreview ? (
                      <div className="relative h-24">
                        <img
                          src={backgroundPreview}
                          alt="Background"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="py-5 text-center bg-slate-50 hover:bg-purple-50 transition-all">
                        <p className="text-slate-600 text-sm font-medium">
                          Upload Background
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>

            {selectedActivityKeys.includes("AI Photo Booth") && (
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>

                  <div className="flex-1">
                    <p className="font-semibold text-purple-900">AI Booth Configured</p>
                    <p className="text-sm text-purple-700">
                      {aiPrompts.length} prompt{aiPrompts.length !== 1 ? "s" : ""} •{" "}
                      {aiCharacters.length} character{aiCharacters.length !== 1 ? "s" : ""}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAIConfig(true)}
                    className="text-purple-600 hover:text-purple-700 text-sm font-medium underline"
                  >
                    {aiPrompts.length || aiCharacters.length ? "Edit" : "Configure"}
                  </button>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-medium shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-105 transition-all duration-200"
              >
                {isEditMode ? "Update Event" : "Create Event"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {showAIConfig && (
        <AIConfigModal
          initialPrompts={aiPrompts}
          initialCharacters={aiCharacters}
          onClose={() => setShowAIConfig(false)}
          onFinish={handleAIConfigFinish}
        />
      )}
    </>
  );
};

export default CreateEventModal;