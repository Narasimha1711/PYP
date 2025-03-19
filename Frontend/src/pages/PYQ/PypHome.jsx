import React, { useState, useEffect } from "react";
import axios from "axios";
import SubjectCard from "../../components/PYQ/SubjectCard"; // Importing the SubjectCard component
import { useNavigate } from "react-router-dom";
function PypHome() {
  const [subjects, setSubjects] = useState([]);
  const [starredSubjects, setStarredSubjects] = useState(new Set()); // Store starred subjects
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:9000/pyp", {
          withCredentials: true, // Ensure cookies are sent with the request
        });

        if (response.status === 200) {
          const { subjects, interestedSubjects } = response.data;
          
          setSubjects(subjects);
          setStarredSubjects(new Set(interestedSubjects)); // Convert to Set
        }
      } catch (error) {
        if(error?.response?.data?.message === "Unauthorized: No token provided") {
          navigate('/signin')
        }
        if(error)
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const toggleStar = async (subjectId) => {
    const isStarred = starredSubjects.has(subjectId);
    const url = isStarred
      ? "http://localhost:9000/pyp/deleteStarredSubject"
      : "http://localhost:9000/pyp/addStarredSubject";

    try {
      const response = await axios.post(url, { subjectId }, { withCredentials: true });

      if (response.status === 200) {
        setStarredSubjects((prev) => {
          const newStarred = new Set(prev);
          if (isStarred) {
            newStarred.delete(subjectId);
          } else {
            newStarred.add(subjectId);
          }
          return newStarred;
        });
      }
    } catch (error) {
      console.error("Error updating starred subjects:", error);
    }
  };

  // Separate starred and non-starred subjects
  const starredList = subjects.filter(subject => starredSubjects.has(subject.subjectId));
  const nonStarredList = subjects.filter(subject => !starredSubjects.has(subject.subjectId));

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* ⭐ Starred Subjects Section */}
      {starredList.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Starred Subjects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {starredList.map((subject) => (
              <SubjectCard
                key={subject.subjectId}
                subject={subject}
                isStarred={true}
                onStarToggle={toggleStar}
              />
            ))}
          </div>
        </div>
      )}

      {/* 📌 All Subjects Section */}
      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">All Subjects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nonStarredList.map((subject) => (
          <SubjectCard
            key={subject.subjectId}
            subject={subject}
            isStarred={false}
            onStarToggle={toggleStar}
          />
        ))}
      </div>
    </div>
  );
}

export default PypHome;