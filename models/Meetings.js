const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema({
  title: { type: String, required: [true, "Title is required"] },
  organiser: { type: String, required: [true, "Organiser is required"] },
  project: { type: String, required: [true, "Project is required"] },
  start: {
    type: Date,
    required: [true, "Start date is required"],
    validate: {
      validator: function(value) {
        // Ensure value is a valid date
        return value instanceof Date && !isNaN(value.getTime());
      },
      message: "Invalid start date"
    }
  },
  end: {
    type: Date,
    required: [true, "End date is required"],
    validate: {
      validator: function(value) {
        // Ensure value is a valid date
        return value instanceof Date && !isNaN(value.getTime());
      },
      message: "Invalid end date"
    }
  },
  roomId: { type: String, required: [true, "Room ID is required"] }
});

// Pre-save hook for additional custom validations
meetingSchema.pre("save", function(next) {
  const now = new Date();

  // Ensure the start date is not in the past
  if (this.start < now) {
    return next(new Error("Start date cannot be in the past"));
  }

  // Ensure the start date comes before the end date
  if (this.start >= this.end) {
    return next(new Error("Start date must be before end date"));
  }

  // Ensure the event is contained within a single day
  if (this.start.toDateString() !== this.end.toDateString()) {
    return next(new Error("Event must occur on a single day"));
  }

  next();
});

module.exports = mongoose.model("Meeting", meetingSchema);
