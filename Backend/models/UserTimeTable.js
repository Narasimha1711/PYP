const mongoose = require("mongoose");

const timeSlots = [
  "08:45-09:45",
  "09:45-10:45",
  "11:00-12:00",
  "12:00-13:00",
  "14:15-15:15",
  "15:15-16:15",
  "16:30-17:30",
];

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

// Schema for each time slot
const timeSlotSchema = new mongoose.Schema({
  time: { type: String, enum: timeSlots, required: true },
  subjects: { type: [String], default: [] },
});

// Schema for each day
const daySchema = new mongoose.Schema({
  day: { type: String, enum: daysOfWeek, required: true },
  schedule: {
    type: [timeSlotSchema],
    default: () => timeSlots.map((slot) => ({ time: slot, subjects: [] })),
  },
});

// Schema for a full year
const yearSchema = new mongoose.Schema({
  days: {
    type: [daySchema],
    default: () =>
      daysOfWeek.map((day) => ({
        day,
        schedule: timeSlots.map((slot) => ({ time: slot, subjects: [] })),
      })),
  },
});

const userTimeTableSchema = new mongoose.Schema({
  rollNumber: {
    type: String,
    required: true,
    unique: true,
  },
  timetable: {
    type: yearSchema,
    required: false,
  },
  subjects: {
    type: [String],
    required: true,
  },
  UG: {
    type: String,
    enum: ["UG1", "UG2", "UG3", "UG4"],
    required: false,
  },
});

const UserTimeTable = mongoose.model("UserTimeTable", userTimeTableSchema);

module.exports = UserTimeTable;
