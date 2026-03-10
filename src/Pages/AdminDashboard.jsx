import React, { useState,useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import EventCard from '../AdminDashboard-Components/EventCard';
import CreateEventModal from '../AdminDashboard-Components/CreateEventModal';
import axios from "axios";
const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  
  const [selectedEvent, setSelectedEvent] = useState(null);
const [isEditMode, setIsEditMode] = useState(false);
const [isModalOpen, setIsModalOpen] = useState(false);


const navigate = useNavigate();

const handleOpenEvent = (event) => {
  navigate(`/${event._id}`);
};

 const handleCreateEvent = (newEvent) => {
  setEvents(prev => [newEvent, ...prev]);
 
};

const handleEdit = (event) => {
  setSelectedEvent(event);
  setIsEditMode(true);
  setIsModalOpen(true);
};

const handleUpdateEvent = (updatedEvent) => {
  setEvents((prevEvents) =>
    prevEvents.map((event) =>
      event._id === updatedEvent._id ? updatedEvent : event
    )
  );

  setIsModalOpen(false);
};

const handleDelete = async (id) => {
  try {
    await axios.delete(`http://localhost:5000/api/events/${id}`);

    
    setEvents((prev) => prev.filter((event) => event._id !== id));

  } catch (error) {
    console.error("Delete Error:", error);
  }
};

useEffect(()=>{
 fetch("http://localhost:5000/api/events/all")
 .then(res=>res.json())
 .then(data=>setEvents(data))
},[])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                Event Admin Panel
              </h1>
              <p className="text-slate-600 mt-1 text-sm">
                Manage your events and activities
              </p>
            </div>
            <button
             onClick={() => {
    setIsEditMode(false);     
    setSelectedEvent(null);
    setIsModalOpen(true);     
  }}
              className="group relative px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-medium shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-105 transition-all duration-200 flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Create Event
            </button>
          </div>
        </div>
      </header>


      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {events.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fadeIn">
            <div className="relative w-64 h-64 mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full opacity-20 blur-3xl animate-pulse"></div>
              <svg
                className="w-full h-full relative z-10"
                viewBox="0 0 200 200"
                fill="none"
              >
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  stroke="url(#gradient)"
                  strokeWidth="2"
                  strokeDasharray="8 8"
                  className="animate-spin-slow"
                />
                <circle cx="100" cy="100" r="60" fill="url(#gradient)" opacity="0.1" />
                <path
                  d="M100 60v80M60 100h80"
                  stroke="url(#gradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#9333ea" />
                    <stop offset="100%" stopColor="#7c3aed" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              No Events Yet
            </h2>
            <p className="text-slate-600 mb-8 text-center max-w-md">
              Get started by creating your first event and managing your activities
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-medium shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-105 transition-all duration-200"
            >
              Create First Event
            </button>
          </div>
        ) : (
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
            {events?.map((event) => (
  <div key={event._id}>
    <EventCard event={event}
    onDelete={handleDelete}
    onEdit={handleEdit}
    onOpen={handleOpenEvent} />
    
  </div>
))}
          </div>
        )}
      </main>

      
   {isModalOpen && (
  <CreateEventModal
    onClose={() => setIsModalOpen(false)}
    onCreateEvent={handleCreateEvent}
    onUpdateEvent={handleUpdateEvent}
    selectedEvent={selectedEvent}
    isEditMode={isEditMode}
  />
)}
    </div>
  );
};

export default AdminDashboard;                