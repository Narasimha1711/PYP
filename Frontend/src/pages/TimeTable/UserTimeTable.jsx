import React, { useState, useEffect } from "react";
import axios from "axios";

export default function UserTimeTable() {
  const [UG, setUG] = useState("");
  const [UGOptions, setUGOptions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [personalizedTimetable, setPersonalizedTimetable] = useState(null);
  const [nextClass, setNextClass] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:9000/utt/getUserTimeTable", { withCredentials: true })
      .then((response) => {
        if (response.data.flag === 0) {
          setUGOptions(response.data.UGs);
        } else if (response.data.flag === 1) {
          setPersonalizedTimetable(response.data.timetable);
        }
      })
      .catch((error) => console.error("Error fetching timetable:", error));
  }, []);

  useEffect(() => {
    if (personalizedTimetable) {
      const fetchNextClass = () => {
        axios
          .get("http://localhost:9000/utt/getUserNextClass", { withCredentials: true })
          .then((response) => {
            if (response.data && response.data.time && response.data.subjects) {
              setNextClass({
                time: response.data.time,
                subjects: response.data.subjects.join(", ")
              });
            } else {
              setNextClass(null);
            }
          })
          .catch((error) => console.error("Error fetching next class:", error));
      };
      fetchNextClass();
      const interval = setInterval(fetchNextClass, 20000);
      return () => clearInterval(interval);
    }
  }, [personalizedTimetable]);

  const handleUGSelect = (selectedUG) => {
    // Allow changing UG at any time - removed the condition that prevented changing
    setUG(selectedUG);
    const ugData = UGOptions.find((item) => item.UG === selectedUG);
    setSubjects(ugData ? ugData.subjects : []);
    // Reset selected subjects when changing UG
    setSelectedSubjects([]);
  };

  const handleSelect = (subject) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]
    );
  };

  const handleSubmit = () => {
    axios
      .post("http://localhost:9000/utt/submitUserTimeTableSubjects", { UG, subjects: selectedSubjects }, { withCredentials: true })
      .then(() => axios.get("http://localhost:9000/utt/getUserTimeTable", { withCredentials: true }))
      .then((response) => {
        if (response.data.flag === 1) {
          setPersonalizedTimetable(response.data.timetable);
        }
      })
      .catch((error) => console.error("Error submitting subjects or fetching timetable:", error));
  };

  const handleChangeTimetable = () => {
    axios
      .delete("http://localhost:9000/utt/deleteUserTimeTable", { withCredentials: true })
      .then(() => {
        setUG("");
        setSubjects([]);
        setSelectedSubjects([]);
        setPersonalizedTimetable(null);
        setNextClass(null);
      })
      .catch((error) => console.error("Error deleting timetable:", error));
  };

  // Helper function to check if a time slot is current
  const isCurrentTimeSlot = (timeSlot) => {
    if (!timeSlot || !timeSlot.includes(' - ')) return false;
    
    try {
      const [startTime, endTime] = timeSlot.split(' - ');
      
      if (!startTime || !endTime) return false;
      
      const [startHour, startMinute] = startTime.split(':').map(Number);
      const [endHour, endMinute] = endTime.split(':').map(Number);
      
      if (isNaN(startHour) || isNaN(startMinute) || isNaN(endHour) || isNaN(endMinute)) return false;
      
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      
      const currentTimeInMinutes = currentHour * 60 + currentMinute;
      const startTimeInMinutes = startHour * 60 + startMinute;
      const endTimeInMinutes = endHour * 60 + endMinute;
      
      return currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes <= endTimeInMinutes;
    } catch (error) {
      console.error("Error parsing time slot:", error);
      return false;
    }
  };

  // Helper function to render time slots consistently
  const renderTimeTable = () => {
    if (!personalizedTimetable || !personalizedTimetable.days) return null;
    
    // Find all unique time slots across all days
    const allTimeSlots = new Set();
    personalizedTimetable.days.forEach(day => {
      day.schedule.forEach(slot => {
        if (slot.time) {
          allTimeSlots.add(slot.time);
        }
      });
    });
    
    // Convert to array and sort
    const sortedTimeSlots = Array.from(allTimeSlots).sort();
    
    // Get current day and time for highlighting
    const now = new Date();
    const currentDay = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][now.getDay()];
    
    return (
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Time
              </th>
              {personalizedTimetable.days.map(day => (
                <th 
                  key={day.day} 
                  scope="col" 
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    day.day === currentDay ? "bg-gray-700 text-yellow-300" : "text-white"
                  }`}
                >
                  {day.day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedTimeSlots.map(timeSlot => {
              // Check if this time slot is current
              const slotIsCurrent = isCurrentTimeSlot(timeSlot);
              
              return (
                <tr key={timeSlot} className={`hover:bg-gray-50 ${slotIsCurrent ? "bg-green-50" : ""}`}>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 ${
                    slotIsCurrent ? "bg-green-100" : "bg-gray-100"
                  }`}>
                    {timeSlot}
                  </td>
                  {personalizedTimetable.days.map(day => {
                    const slot = day.schedule.find(s => s.time === timeSlot);
                    const subjects = slot?.subjects ? slot.subjects.join(", ") : "";
                    const hasSubjects = subjects !== "";
                    
                    // Check if this is the current class cell
                    const isCurrentClass = slotIsCurrent && day.day === currentDay;
                    
                    return (
                      <td 
                        key={`${day.day}-${timeSlot}`} 
                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                          isCurrentClass ? "bg-green-100" : ""
                        }`}
                      >
                        {hasSubjects ? (
                          <div className={`rounded-md py-2 px-3 ${
                            isCurrentClass 
                              ? "bg-green-200 text-green-800 border-2 border-green-500 font-medium shadow-sm" 
                              : "bg-blue-50 text-blue-800"
                          }`}>
                            {subjects}
                            {isCurrentClass && (
                              <div className="mt-1 text-xs font-bold text-green-700 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                CURRENT CLASS
                              </div>
                            )}
                          </div>
                        ) : isCurrentClass ? (
                          <div className="rounded-md py-2 px-3 bg-green-200 text-green-800 border-2 border-green-500 font-medium shadow-sm">
                            Free Time
                            <div className="mt-1 text-xs font-bold text-green-700 flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              CURRENT TIME
                            </div>
                          </div>
                        ) : null}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="p-4 max-w-7xl mx-auto relative">
      {nextClass && personalizedTimetable && (
        <div className="sticky top-4 z-10 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-200 to-yellow-300 p-4 rounded-lg shadow-lg mb-6 border-l-4 border-yellow-500 max-w-md mx-auto">
          <div className="flex items-center">
            <div className="mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-yellow-900">Next Class</h3>
              <p className="font-medium text-yellow-800"><span className="font-semibold">Time:</span> {nextClass.time}</p>
              <p className="font-medium text-yellow-800"><span className="font-semibold">Subject:</span> {nextClass.subjects}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        {personalizedTimetable ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500">
                  Your Personalized Timetable
                </span>
              </h2>
              <button 
                onClick={handleChangeTimetable} 
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow transition duration-200 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Change Timetable
              </button>
            </div>
            {renderTimeTable()}
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500">
                Create Your Personal Timetable
              </span>
            </h2>
            
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-3">Step 1: Select Your UG Level</h3>
              <div className="flex flex-wrap gap-3 mb-4">
                {UGOptions.map((option) => (
                  <button
                    key={option.UG}
                    onClick={() => handleUGSelect(option.UG)}
                    className={`px-5 py-2 rounded-full border-2 transition-all duration-200 font-medium ${
                      UG === option.UG 
                        ? "border-blue-500 bg-blue-500 text-white shadow-md" 
                        : "border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50"
                    }`}
                  >
                    {option.UG}
                  </button>
                ))}
              </div>
            </div>
            
            {UG && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-700 mb-3">Step 2: Select Your Subjects</h3>
                <div className="flex flex-wrap gap-3 mb-6">
                  {subjects.map((subject) => (
                    <button
                      key={subject}
                      onClick={() => handleSelect(subject)}
                      className={`px-4 py-2 rounded-full border-2 transition-all duration-200 ${
                        selectedSubjects.includes(subject)
                          ? "border-green-500 bg-green-500 text-white shadow-md"
                          : "border-gray-300 bg-white text-gray-700 hover:border-green-400 hover:bg-green-50"
                      }`}
                    >
                      {subject}
                    </button>
                  ))}
                </div>
                
                {selectedSubjects.length > 0 && (
                  <div className="flex justify-center">
                    <button 
                      onClick={handleSubmit} 
                      className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg shadow-md transition duration-200 flex items-center font-medium"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Generate My Timetable
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}