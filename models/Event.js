import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true
  },

  companyName: {
    type: String,
    required: true
  },

  
  location: {
    type: String,
    default: ""
  },

  
  eventDate: {
    type: Date,
    default: null
  },

   activities: {
    type: [mongoose.Schema.Types.Mixed],
    default: []
  },

  logo: {
    type: String,
    default: ""
  },

  backgroundImage: {
    type: String,
    default: ""
  }

}, { timestamps: true ,versionKey: false  });

export default mongoose.model("Event", eventSchema);