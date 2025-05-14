// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import SubjectCard from "../../components/PYQ/SubjectCard"; // Importing the SubjectCard component
// import { useNavigate } from "react-router-dom";
// function PypHome() {
//   const [subjects, setSubjects] = useState([]);
//   const [starredSubjects, setStarredSubjects] = useState(new Set()); // Store starred subjects
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get("http://localhost:9000/pyp", {
//           withCredentials: true, // Ensure cookies are sent with the request
//         });

//         if (response.status === 200) {
//           const { subjects, interestedSubjects } = response.data;
          
//           setSubjects(subjects);
//           setStarredSubjects(new Set(interestedSubjects)); // Convert to Set
//         }
//       } catch (error) {
//         if(error?.response?.data?.message === "Unauthorized: No token provided") {
//           navigate('/signin')
//         }
//         if(error)
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   const toggleStar = async (subjectId) => {
//     const isStarred = starredSubjects.has(subjectId);
//     const url = isStarred
//       ? "http://localhost:9000/pyp/deleteStarredSubject"
//       : "http://localhost:9000/pyp/addStarredSubject";

//     try {
//       const response = await axios.post(url, { subjectId }, { withCredentials: true });

//       if (response.status === 200) {
//         setStarredSubjects((prev) => {
//           const newStarred = new Set(prev);
//           if (isStarred) {
//             newStarred.delete(subjectId);
//           } else {
//             newStarred.add(subjectId);
//           }
//           return newStarred;
//         });
//       }
//     } catch (error) {
//       console.error("Error updating starred subjects:", error);
//     }
//   };

//   // Separate starred and non-starred subjects
//   const starredList = subjects.filter(subject => starredSubjects.has(subject.subjectId));
//   const nonStarredList = subjects.filter(subject => !starredSubjects.has(subject.subjectId));

//   return (
//     <div className="min-h-screen bg-gray-50 font-sans">
//       {/* ⭐ Starred Subjects Section */}
//       {starredList.length > 0 && (
//         <div>
//           <h2 className="text-2xl font-semibold text-gray-900 mb-4">Starred Subjects</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {starredList.map((subject) => (
//               <SubjectCard
//                 key={subject.subjectId}
//                 subject={subject}
//                 isStarred={true}
//                 onStarToggle={toggleStar}
//               />
//             ))}
//           </div>
//         </div>
//       )}

//       {/* 📌 All Subjects Section */}
//       <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">All Subjects</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {nonStarredList.map((subject) => (
//           <SubjectCard
//             key={subject.subjectId}
//             subject={subject}
//             isStarred={false}
//             onStarToggle={toggleStar}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

// export default PypHome;


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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white font-sans py-8 px-4 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-blue-800 mb-8 text-center">Previous Year Papers</h1>
        
        {/* ⭐ Starred Subjects Section */}
        {starredList.length > 0 && (
          <div className="mb-12 bg-white rounded-xl shadow-lg p-6 border border-blue-100">
            <div className="flex items-center mb-6">
              <svg className="w-6 h-6 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <h2 className="text-2xl font-semibold text-gray-900">Starred Subjects</h2>
            </div>
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

        {/* 📚 All Subjects Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
          <div className="flex items-center mb-6">
            <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
            <h2 className="text-2xl font-semibold text-gray-900">All Subjects</h2>
          </div>
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
        
        {/* Empty state if no subjects */}
        {subjects.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No subjects found</h3>
            <p className="mt-1 text-sm text-gray-500">Try refreshing the page or check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PypHome;