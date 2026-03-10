import React from "react";
import { Pencil, Trash2 } from "lucide-react";

const EventCard = ({ event, onEdit, onDelete, onOpen }) => {
  if (!event) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCreatedDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const hasAIConfig = event?.activities?.some((activity) => {
  if (typeof activity === "string") {
    try {
      const parsed = JSON.parse(activity);

      if (Array.isArray(parsed)) {
        return parsed.some(
          (item) =>
            item?.key === "AI Photo Booth" &&
            (item?.prompts?.length > 0 || item?.config?.prompts?.length > 0)
        );
      }

      return (
        parsed?.key === "AI Photo Booth" &&
        (parsed?.prompts?.length > 0 || parsed?.config?.prompts?.length > 0)
      );
    } catch {
      return activity === "AI Photo Booth";
    }
  }

  return (
    activity?.key === "AI Photo Booth" &&
    (activity?.prompts?.length > 0 || activity?.config?.prompts?.length > 0)
  );
});

  return (
    <div
      onClick={() => onOpen?.(event)}
      className="group relative bg-white rounded-2xl border border-slate-200 hover:border-purple-300 transition-all duration-300 hover:shadow-xl hover:shadow-purple-100 overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-600 to-purple-400"></div>

      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(event);
          }}
          className="p-2 rounded-full bg-white shadow hover:bg-purple-100 transition"
        >
          <Pencil size={16} className="text-purple-600" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(event._id);
          }}
          className="p-2 rounded-full bg-white shadow hover:bg-red-100 transition"
        >
          <Trash2 size={16} className="text-red-600" />
        </button>
      </div>

      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-purple-600 transition-colors">
            {event.eventName || "Event"}
          </h3>
          <p className="text-sm text-slate-600 font-medium">
            {event.companyName || "Company"}
          </p>
        </div>

        <div className="space-y-2 mb-4 text-sm text-slate-700">
          <div>{event.location || "No location"}</div>
          <div>{formatDate(event.eventDate)}</div>
        </div>

        <div className="mb-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Activities
          </p>

         <div className="flex flex-wrap gap-2">
  {event?.activities?.length > 0 ? (
    event.activities.map((activity, index) => {
      let activityName = "Unnamed Activity";

      if (typeof activity === "string") {
        try {
          const parsed = JSON.parse(activity);

          if (Array.isArray(parsed)) {
            activityName = parsed.map((item) => item?.key).filter(Boolean).join(", ");
          } else if (parsed?.key) {
            activityName = parsed.key;
          } else {
            activityName = activity;
          }
        } catch {
          activityName = activity;
        }
      } else {
        activityName = activity?.key || "Unnamed Activity";
      }

      return (
        <span
          key={index}
          className="px-3 py-1 rounded-full text-xs bg-purple-100 text-purple-700"
        >
          {activityName}
        </span>
      );
    })
  ) : (
    <span className="text-xs text-gray-400">No activities</span>
  )}
</div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Created {formatCreatedDate(event.createdAt)}
          </span>

          {hasAIConfig && (
            <div className="px-2 py-1 rounded-full bg-purple-600 text-white text-xs">
              AI
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;