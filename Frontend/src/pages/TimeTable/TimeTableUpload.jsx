import React, { useState, useEffect } from "react";
import axios from "axios";

const TimetableForm = () => {
  const years = ["UG1", "UG2", "UG3", "UG4"];
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const timeSlots = [
    "08:45-09:45",
    "09:45-10:45",
    "11:00-12:00",
    "12:00-13:00",
    "14:15-15:15",
    "15:15-16:15",
    "16:30-17:30",
  ];

  const initializeTimetable = () => {
    return years.reduce((acc, year) => {
      acc[year] = {
        days: days.map((day) => ({
          day,
          schedule: timeSlots.map((time) => ({
            time,
            subjects: [],
          })),
        })),
      };
      return acc;
    }, {});
  };

  const [timetable, setTimetable] = useState(() => initializeTimetable());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const response = await axios.get("http://localhost:9000/tt/getTimetable");
        if (response.data && Object.keys(response.data).length > 0) {
          setTimetable(response.data);
        } else {
          setTimetable(initializeTimetable());
        }
      } catch (err) {
        setError("Failed to load timetable.");
        setTimetable(initializeTimetable());
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, []);

  const handleSubjectChange = (year, day, time, subject) => {
    setTimetable((prev) => {
      const newTimetable = JSON.parse(JSON.stringify(prev));
      const dayData = newTimetable[year].days.find((d) => d.day === day);

      if (dayData) {
        const slot = dayData.schedule.find((s) => s.time === time);
        if (slot) {
          slot.subjects = subject.split(",").map((s) => s.trim());
        }
      }
      return newTimetable;
    });
  };

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:9000/tt/upload", timetable, {
        headers: { "Content-Type": "application/json" },
      });
      alert("Timetable submitted successfully!");
    } catch (error) {
      alert("Failed to submit timetable.");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete("http://localhost:9000/tt/deleteTimeTable");
      setTimetable(initializeTimetable());
      alert("Timetable deleted successfully!");
    } catch (error) {
      alert("Failed to delete timetable.");
    }
  };

  if (loading) return <div className="text-center text-lg text-blue-600">Loading timetable...</div>;
  if (error) return <div className="text-center text-lg text-red-600">{error}</div>;

  return (
    <div className="p-8 bg-gray-100 min-h-screen space-y-10">
      <h2 className="text-4xl font-bold text-center text-blue-600">Timetable Input</h2>
      {years.map((year) => (
        <div key={year} className="bg-white shadow-lg rounded-xl p-6 max-w-5xl mx-auto">
          <h3 className="text-2xl font-semibold text-gray-700 text-center mb-5 bg-blue-100 p-3 rounded-lg">
            {year}
          </h3>
          <div className="space-y-6">
            {days.map((day) => (
              <div key={day} className="bg-gray-50 p-4 rounded-lg shadow">
                <h4 className="text-lg font-medium text-gray-600 mb-3">{day}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {timeSlots.map((time) => {
                    const dayData = timetable[year].days.find((d) => d.day === day);
                    const slot = dayData?.schedule.find((s) => s.time === time);

                    return (
                      <div key={time} className="flex flex-col gap-2">
                        <span className="text-gray-500 text-sm font-medium">{time}</span>
                        <input
                          type="text"
                          className="border rounded-md p-2 text-sm w-full bg-gray-50 focus:ring-2 focus:ring-blue-300"
                          placeholder="Enter subjects (comma separated)"
                          value={slot?.subjects.join(", ") || ""}
                          onChange={(e) => handleSubjectChange(year, day, time, e.target.value)}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="flex justify-center mt-8 space-x-4">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition"
        >
          Submit Timetable
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-8 py-3 rounded-lg shadow-lg hover:bg-red-700 transition"
        >
          Delete Timetable
        </button>
      </div>
    </div>
  );
};

export default TimetableForm;