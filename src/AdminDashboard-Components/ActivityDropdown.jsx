import React, { useState, useRef, useEffect } from 'react';

const ActivityDropdown = ({ selectedActivities, onChange }) => {
  const defaultActivities = ['AI Photo Booth', 'Normal Photo Booth', 'Digital Caricature'];
  const [isOpen, setIsOpen] = useState(false);
  const [activities, setActivities] = useState(defaultActivities);
  const [newActivity, setNewActivity] = useState('');
  const [showAddInput, setShowAddInput] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setShowAddInput(false);
        setNewActivity('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleActivity = (activity) => {
    if (selectedActivities.includes(activity)) {
      onChange(selectedActivities.filter((a) => a !== activity));
    } else {
      onChange([...selectedActivities, activity]);
    }
  };

  const handleAddCustomActivity = () => {
    if (newActivity.trim() && !activities.includes(newActivity.trim())) {
      const trimmedActivity = newActivity.trim();
      setActivities([...activities, trimmedActivity]);
      onChange([...selectedActivities, trimmedActivity]);
      setNewActivity('');
      setShowAddInput(false);
    }
  };

  const handleRemoveActivity = (activityToRemove, e) => {
    e.stopPropagation();
    onChange(selectedActivities.filter((a) => a !== activityToRemove));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="min-h-[48px] w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all cursor-pointer bg-white hover:border-purple-300"
      >
        {selectedActivities.length === 0 ? (
          <span className="text-slate-400">Select activities...</span>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selectedActivities.map((activity) => (
              <span
                key={activity}
                className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 rounded-full text-sm font-medium border border-purple-200"
              >
                {activity}
                <button
                  onClick={(e) => handleRemoveActivity(activity, e)}
                  className="hover:bg-purple-200 rounded-full p-0.5 transition-colors"
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-20 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-slideDown">
          <div className="max-h-64 overflow-y-auto">
            {activities.map((activity) => (
              <div
                key={activity}
                onClick={() => handleToggleActivity(activity)}
                className="px-4 py-3 hover:bg-purple-50 cursor-pointer transition-colors flex items-center justify-between group"
              >
                <span className="text-slate-700 font-medium">{activity}</span>
                {selectedActivities.includes(activity) && (
                  <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            ))}
          </div>

          <div className="border-t border-slate-200 bg-slate-50">
            {!showAddInput ? (
              <button
                onClick={() => setShowAddInput(true)}
                className="w-full px-4 py-3 text-left text-purple-600 font-medium hover:bg-purple-50 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add New Activity
              </button>
            ) : (
              <div className="p-3 flex gap-2">
                <input
                  type="text"
                  value={newActivity}
                  onChange={(e) => setNewActivity(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCustomActivity()}
                  placeholder="Enter activity name..."
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  autoFocus
                />
                <button
                  onClick={handleAddCustomActivity}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                >
                  Add
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityDropdown;
