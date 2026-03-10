import Event from "../models/Event.js";

const createEvent = async (req, res) => {
  try {
    const { eventName, activities, companyName, location, eventDate } = req.body;

    let parsedActivities = [];

    if (Array.isArray(activities)) {
      parsedActivities = activities;
    } else if (typeof activities === "string") {
      parsedActivities = [activities];
    }

    const logo = req.files?.logo
      ? `/uploads/${req.files.logo[0].filename}`
      : "";

    const backgroundImage = req.files?.backgroundImage
      ? `/uploads/${req.files.backgroundImage[0].filename}`
      : "";

    const newEvent = new Event({
      eventName,
      companyName,
      location,
      eventDate,
      activities: parsedActivities,
      logo,
      backgroundImage
    });

    await newEvent.save();

    res.status(201).json({ success: true, event: newEvent });

  } catch (err) {
    console.log("CREATE EVENT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};


const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;  

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    await Event.findByIdAndDelete(id);

    res.json({ success: true, message: "Event deleted successfully" });

  } catch (err) {
    console.log("DELETE EVENT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { eventName, companyName, location, eventDate, activities } = req.body;

    let parsedActivities = [];

    if (Array.isArray(activities)) {
      parsedActivities = activities;
    } else if (typeof activities === "string") {
      parsedActivities = [activities];
    }

    const updatedData = {
      eventName,
      companyName,
      location,
      eventDate,
      activities: parsedActivities,
    };

    
    if (req.files?.logo) {
      updatedData.logo = `/uploads/${req.files.logo[0].filename}`;
    }

    if (req.files?.backgroundImage) {
      updatedData.backgroundImage = `/uploads/${req.files.backgroundImage[0].filename}`;
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ success: true, event: updatedEvent });

  } catch (err) {
    console.log("UPDATE EVENT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export { createEvent, getAllEvents, deleteEvent, updateEvent };