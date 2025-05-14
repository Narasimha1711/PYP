const express = require("express");
const jwt = require("jsonwebtoken");
const TimeTable = require("../models/TimeTable");
const UserTimeTable = require("../models/UserTimeTable");

const router = express.Router();

// Middleware to extract roll number from cookies
const authenticateUser = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ message: "Unauthorized" });

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.rollNo = decoded.rollNo;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

// Function to get user timetable with UG-wise subject mapping
const getUserTimeTable = async (req, res) => {
    try {
        console.log("Fetching User TimeTable...");

        const token = req.cookies.token;
        if (!token) return res.status(401).json({ message: "Unauthorized" });

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const rollNo = decoded.rollNo;

        // Check if user exists in UserTimeTable
        const userTimeTable = await UserTimeTable.findOne({ rollNumber: rollNo });

        if (userTimeTable) {
            return res.json({ flag: 1, timetable: userTimeTable.timetable });
        }

        // If user doesn't exist, fetch subjects from TimeTable
        const timeTable = await TimeTable.findOne();

        if (!timeTable) {
            return res.json({ flag: 0, UGs: [], other: [] });
        }

        // Extract subjects grouped by UG levels (UG1, UG2, UG3, UG4)
        const subjectsByUG = {};
        ["UG1", "UG2", "UG3", "UG4"].forEach((UG) => {
            if (timeTable[UG] && Array.isArray(timeTable[UG].days)) {
                subjectsByUG[UG] = new Set();

                timeTable[UG].days.forEach((day) => {
                    if (day.schedule && Array.isArray(day.schedule)) {
                        day.schedule.forEach((slot) => {
                            slot.subjects.forEach((subject) => subjectsByUG[UG].add(subject));
                        });
                    }
                });
            }
        });

        // Convert Set values to arrays
        const formattedSubjects = Object.entries(subjectsByUG).map(([UG, subjects]) => ({
            UG,
            subjects: Array.from(subjects),
        }));

        return res.json({ flag: 0, UGs: formattedSubjects, other: formattedSubjects });
    } catch (error) {
        console.error("Error fetching user timetable:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const submitUserTimeTableSubjects = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ message: "Unauthorized" });

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const rollNo = decoded.rollNo;

        const { UG, subjects } = req.body;
        if (!UG || !Array.isArray(subjects) || subjects.length === 0) {
            return res.status(400).json({ message: "Invalid input data" });
        }

        // Fetch the common UG timetable
        const commonTimetable = await TimeTable.findOne();
        if (!commonTimetable || !commonTimetable[UG]) {
            return res.status(404).json({ message: "Common timetable not found for UG" });
        }

        const commonUGTimeTable = commonTimetable[UG].days;

        // Generate personalized timetable by filtering the common timetable
        const personalizedTimeTable = {
            days: commonUGTimeTable.map((day) => ({
                day: day.day,
                schedule: day.schedule
                    .map((slot) => ({
                        time: slot.time,
                        subjects: slot.subjects.filter((subj) => subjects.includes(subj)), // Match user's subjects
                    }))
                    .filter((slot) => slot.subjects.length > 0), // Keep only relevant slots
            })).filter((day) => day.schedule.length > 0), // Keep only days with classes
        };

        // Check if the user already has a timetable entry
        let userTimeTable = await UserTimeTable.findOne({ rollNumber: rollNo });

        if (userTimeTable) {
            // Update existing entry
            userTimeTable.UG = UG;
            userTimeTable.subjects = subjects;
            userTimeTable.timetable = personalizedTimeTable;
            await userTimeTable.save();
            return res.json({ message: "User timetable updated successfully" });
        } else {
            // Create new entry
            const newUserTimeTable = new UserTimeTable({
                rollNumber: rollNo,
                UG,
                subjects,
                timetable: personalizedTimeTable,
            });

            await newUserTimeTable.save();
            return res.json({ message: "User timetable saved successfully" });
        }
    } catch (error) {
        console.error("Error saving user timetable:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Function to delete the user's timetable
const deleteUserTimeTable = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ message: "Unauthorized" });

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const rollNo = decoded.rollNo;

        // Delete the user's timetable entry
        const result = await UserTimeTable.deleteOne({ rollNumber: rollNo });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "User timetable not found" });
        }

        return res.json({ message: "User timetable deleted successfully" });
    } catch (error) {
        console.error("Error deleting user timetable:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};





const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const getUserNextClass = async (req, res) => {
    try {
      const token = req.cookies.token;
      if (!token) return res.status(401).json({ message: "Unauthorized" });
  
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      const rollNo = decoded.rollNo;
  
      const userTimeTable = await UserTimeTable.findOne({ rollNumber: rollNo });
  
      if (!userTimeTable || !userTimeTable.timetable || !userTimeTable.timetable.days) {
        return res.status(404).json({ message: "User timetable not found" });
      }
  
        const now = new Date();
        // const now = new Date("2025-03-24T10:00:00");
        let currentDayIndex = now.getDay() - 1; // Monday = 0, ..., Friday = 4
        let currentTime = now.getHours() * 60 + now.getMinutes();
  
      // Convert time slot string ("08:45") to total minutes
      const parseTime = (timeString) => {
        const [hours, minutes] = timeString.split(":").map(Number);
        return hours * 60 + minutes;
      };
  
      // Friday, Saturday, and Sunday Reset Fix
      const fridayCutoff = parseTime("17:30"); // Friday 5:30 PM
      const mondayStart = parseTime("08:00"); // Monday 8:00 AM
  
      // If today is **Saturday (5) or Sunday (6)** OR it's **Friday after 5:30 PM**, reset to Monday 08:00 AM
      if (currentDayIndex >= 5 || (currentDayIndex === 4 && currentTime > fridayCutoff)) {
        console.log("Weekend detected! Resetting to Monday 08:00 AM.");
        currentDayIndex = 0; // Move to Monday
        currentTime = mondayStart; // Start from 08:00 AM
      }
  
      // Function to find the next class for a given day
      const findNextClass = (day, checkToday = false) => {
        const daySchedule = userTimeTable.timetable.days.find(d => d.day === day);
        if (!daySchedule || !daySchedule.schedule) return null;
  
        for (const slot of daySchedule.schedule) {
          if (!slot.subjects || slot.subjects.length === 0) continue; // Skip empty slots
  
          const [start, end] = slot.time.split("-").map(parseTime);
  
          // If checking today, consider only upcoming classes
          if (checkToday && start <= currentTime) continue;
  
          return { day, time: slot.time, subjects: slot.subjects };
        }
        return null;
      };
  
      let nextClass = null;
  
      // Step 1️⃣: Check remaining classes **today**
      nextClass = findNextClass(daysOfWeek[currentDayIndex], true);
  
      // Step 2️⃣: If no class today, check the **next available day**
      if (!nextClass) {
        let nextDayIndex = currentDayIndex;
  
        // Loop through the remaining weekdays
        for (let i = 0; i < daysOfWeek.length; i++) {
          nextDayIndex = (nextDayIndex + 1) % daysOfWeek.length;
          
          // 🔥 Fix: Ensure that **Monday is checked properly after Friday/Saturday/Sunday**
          if (currentDayIndex >= 4 && nextDayIndex === 0) {
            console.log("Ensuring Monday is checked after the weekend.");
          }
  
          nextClass = findNextClass(daysOfWeek[nextDayIndex]);
          if (nextClass) break; // Found the next class, exit loop
        }
      }
  
      if (!nextClass) {
        return res.json({ message: "No upcoming classes for this week." });
      }
  
      console.log("Next class found:", nextClass);
      return res.json(nextClass);
    } catch (error) {
      console.error("Error fetching next class:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  











module.exports = { getUserTimeTable, submitUserTimeTableSubjects, deleteUserTimeTable, getUserNextClass };
