import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const BrandingPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/events/${eventId}`);

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || `Server error: ${res.status}`);
        }

        const data = await res.json();
        console.log("Fetched Event:", data);
        console.log("Fetched Activities Raw:", data.activities);

        setEvent(data);
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to load event");
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const normalizeActivities = (input) => {
    if (!input) return [];

    let parsed = input;

    // step 1: if full value is string, parse it
    if (typeof parsed === "string") {
      try {
        parsed = JSON.parse(parsed);
      } catch {
        parsed = [parsed];
      }
    }

    // step 2: if not array, make array
    if (!Array.isArray(parsed)) {
      parsed = [parsed];
    }

    // step 3: flatten and parse nested stringified values
    const finalActivities = [];

    parsed.forEach((item, index) => {
      let current = item;

      // if array item itself is stringified JSON
      if (typeof current === "string") {
        try {
          current = JSON.parse(current);
        } catch {
          finalActivities.push({
            id: `${index}`,
            label: current,
            value: current,
          });
          return;
        }
      }

      // if parsed string becomes array
      if (Array.isArray(current)) {
        current.forEach((nestedItem, nestedIndex) => {
          let nested = nestedItem;

          if (typeof nested === "string") {
            try {
              nested = JSON.parse(nested);
            } catch {
              finalActivities.push({
                id: `${index}-${nestedIndex}`,
                label: nested,
                value: nested,
              });
              return;
            }
          }

          if (nested && typeof nested === "object") {
            const label =
              nested.key ||
              nested.name ||
              nested.label ||
              `Activity ${index + 1}`;
            finalActivities.push({
              id: `${index}-${nestedIndex}`,
              label,
              value: label,
            });
          }
        });

        return;
      }

      // if object
      if (current && typeof current === "object") {
        const label =
          current.key || current.name || current.label || `Activity ${index + 1}`;
        finalActivities.push({
          id: `${index}`,
          label,
          value: label,
        });
        return;
      }

      // fallback
      finalActivities.push({
        id: `${index}`,
        label: String(current),
        value: String(current),
      });
    });

    return finalActivities;
  };

  const normalizedActivities = useMemo(() => {
    const result = normalizeActivities(event?.activities);
    console.log("Normalized Activities:", result);
    return result;
  }, [event]);

  useEffect(() => {
    if (normalizedActivities.length > 0) {
      setSelectedActivity(normalizedActivities[0].value);
    } else {
      setSelectedActivity("");
    }
  }, [normalizedActivities]);

  const handleStartActivity = () => {
    if (!selectedActivity) {
      alert("Please select an activity");
      return;
    }

    const activity = selectedActivity.toLowerCase().trim();

    if (
      activity.includes("ai photo booth") ||
      activity.includes("normal photo booth") ||
      activity.includes("photo booth") ||
      activity.includes("selfie booth")
    ) {
      navigate(`/CameraCapture/${eventId}`);
      return;
    }

    if (activity.includes("360 booth")) {
      navigate(`/booth360/${eventId}`);
      return;
    }

    if (activity.includes("registration")) {
      navigate(`/registration/${eventId}`);
      return;
    }

    alert(`No page configured for "${selectedActivity}"`);
  };

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-red-600">
        Error: {error}
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  const logoUrl =
    event.logo && String(event.logo).trim()
      ? `http://localhost:5000${event.logo}`
      : null;

  const bgUrl =
    event.backgroundImage && String(event.backgroundImage).trim()
      ? `http://localhost:5000${event.backgroundImage}`
      : null;

  const companyName =
    event.companyName && String(event.companyName).trim()
      ? event.companyName.trim()
      : "";

  const eventName =
    event.eventName && String(event.eventName).trim()
      ? event.eventName.trim()
      : "";

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#fdf8f3] font-[Nunito]">
      <div
        className="fixed inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: bgUrl ? `url(${bgUrl})` : "none",
          backgroundColor: "#fdf8f3",
        }}
      />

      <div className="fixed inset-0 z-10 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-32 h-[500px] w-[650px] rounded-full blur-[90px] bg-[radial-gradient(ellipse,rgba(255,200,150,0.5),transparent_70%)] animate-[drift1_14s_ease-in-out_infinite_alternate]" />
        <div className="absolute top-1/3 -right-28 h-[550px] w-[550px] rounded-full blur-[90px] bg-[radial-gradient(ellipse,rgba(200,180,255,0.4),transparent_70%)] animate-[drift2_18s_ease-in-out_infinite_alternate]" />
        <div className="absolute -bottom-20 left-1/3 h-[400px] w-[500px] rounded-full blur-[90px] bg-[radial-gradient(ellipse,rgba(255,180,180,0.3),transparent_70%)] animate-[drift3_16s_ease-in-out_infinite_alternate]" />
      </div>

      <div className="relative z-20 flex h-full flex-col">
        <header className="animate-fadeDown flex items-center justify-between px-6 py-6 md:px-14 md:py-8">
          <div className="flex items-center gap-4">
            {logoUrl && (
              <img
                src={logoUrl}
                alt="Company Logo"
                className="h-10 object-contain md:h-12"
              />
            )}
            {companyName && (
              <span className="font-[Italiana] text-xl tracking-wider text-[#4a3728] md:text-2xl">
                {companyName}
              </span>
            )}
          </div>
        </header>

        <main className="flex flex-1 items-center justify-center px-4 text-center md:px-6">
          <div className="animate-cardUp w-full max-w-2xl rounded-[28px] border border-white/60 bg-white/35 p-8 shadow-[0_8px_60px_rgba(180,120,80,0.1)] backdrop-blur-2xl md:p-16">
            {eventName && (
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#dc8c50]/20 bg-[#dc8c50]/10 px-4 py-1 text-[9px] uppercase tracking-[0.22em] text-[#a05a28]/80">
                {eventName}
              </div>
            )}

            <h1 className="mb-8 font-[Italiana] text-3xl leading-tight text-[#3a2a1e] md:text-6xl">
              Welcome
              {companyName && (
                <>
                  <br />
                  <em className="italic text-[#a05a32]/70">{companyName}</em>
                </>
              )}
            </h1>

            <div className="mx-auto mb-6 w-full max-w-md">
              <select
                value={selectedActivity}
                onChange={(e) => setSelectedActivity(e.target.value)}
                className="w-full rounded-full border border-[#d9b89f] bg-white/90 px-5 py-4 text-sm text-[#4a3728] shadow-md outline-none focus:ring-2 focus:ring-[#d48050] md:text-base"
              >
                {normalizedActivities.length > 0 ? (
                  normalizedActivities.map((activity) => (
                    <option key={activity.id} value={activity.value}>
                      {activity.label}  
                    </option>
                  ))
                ) : (
                  <option value="">No activities available</option>
                )}
              </select>
            </div>

            <button
              onClick={handleStartActivity}
              disabled={!selectedActivity}
              className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-br from-[#d48050] to-[#b06030] px-10 py-4 text-xs uppercase tracking-[0.22em] text-white shadow-lg transition-all duration-300 hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span>Start Activity</span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-sm transition group-hover:translate-x-1">
                ›
              </span>
            </button>
          </div>
        </main>

        <footer className="flex justify-center py-6 text-[9px] uppercase tracking-[0.22em] text-[#4a3728]/30">
          © 2026 {companyName || "Event"}
        </footer>
      </div>

      <style>
        {`
          @keyframes drift1 {
            from { transform: translate(0,0) scale(1); }
            to { transform: translate(40px,30px) scale(1.08); }
          }
          @keyframes drift2 {
            from { transform: translate(0,0) scale(1); }
            to { transform: translate(-30px,40px) scale(0.95); }
          }
          @keyframes drift3 {
            from { transform: translate(0,0) scale(1); }
            to { transform: translate(20px,-30px) scale(1.05); }
          }
          @keyframes cardUp {
            from { opacity:0; transform: translateY(36px) scale(0.97); }
            to { opacity:1; transform: translateY(0) scale(1); }
          }
          @keyframes fadeDown {
            from { opacity:0; transform: translateY(-16px); }
            to { opacity:1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};

export default BrandingPage;