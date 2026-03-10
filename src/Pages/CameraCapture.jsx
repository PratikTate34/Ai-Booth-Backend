import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Camera from "../Components/Camera";

const CameraCapture = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/events/${eventId}`);

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || `Server error: ${res.status}`);
        }

        const data = await res.json();
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

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-600">
        Error: {error}
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  const logoUrl = event.logo ? `http://localhost:5000${event.logo}` : null;
  const bgUrl = event.backgroundImage
    ? `http://localhost:5000${event.backgroundImage}`
    : null;

  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: bgUrl ? `url(${bgUrl})` : "none",
      }}
    >
      <div className="absolute inset-0 bg-black/30"></div>

      <div className="relative z-10">
        <Camera
          companyLogo={logoUrl}
          backgroundImage={bgUrl}
          companyName={event.companyName}
          eventName={event.eventName}
        />
      </div>
    </div>
  );
};

export default CameraCapture;