const Timetable = require("../models/TimeTable");

// Upload timetable
const uploadTimetable = async (req, res) => {
  try {
    const timetableData = req.body;

    if (!timetableData) {
      return res.status(400).json({ error: "Timetable data is required." });
    }

    let existingTimetable = await Timetable.findOne();

    if (existingTimetable) {
      existingTimetable.UG1 = timetableData.UG1;
      existingTimetable.UG2 = timetableData.UG2;
      existingTimetable.UG3 = timetableData.UG3;
      existingTimetable.UG4 = timetableData.UG4;
      await existingTimetable.save();
      return res.status(200).json({ message: "Timetable updated successfully" });
    } else {
      const newTimetable = new Timetable(timetableData);
      await newTimetable.save();
      return res.status(201).json({ message: "Timetable created successfully" });
    }
  } catch (error) {
    console.error("Error uploading timetable:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get timetable
const getTimetable = async (req, res) => {
  try {
    const timetable = await Timetable.findOne();
    if (!timetable) {
      return res.status(404).json({ error: "No timetable found" });
    }
    res.status(200).json(timetable);
  } catch (error) {
    console.error("Error fetching timetable:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete all timetables
const deleteTimetable = async (req, res) => {
  try {
    console.log("hi");
    const result = await Timetable.deleteMany({});
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "No timetables found to delete" });
    }
    res.status(200).json({ message: "All timetables deleted successfully" });
  } catch (error) {
    console.error("Error deleting timetables:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { uploadTimetable, getTimetable, deleteTimetable };
