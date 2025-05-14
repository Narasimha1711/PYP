import React, { useEffect } from 'react';
import axios from 'axios';
import { GradeSelect } from '../../components/Grade/GradeSelect';
import { updateGrade, setGrades, setCurrentSemester, resetGrades } from '../../app/gradeSlice';
import { useDispatch, useSelector } from 'react-redux';
import { ProgressBar } from '../../../../gradeFiles/ProgressBar';

const semesterSubjects = {
  1: [
    { id: '1', name: 'DLD', credits: 4 },
    { id: '2', name: 'OCW', credits: 4 },
    { id: '3', name: 'CP', credits: 4 },
    { id: '4', name: 'DSMA', credits: 4 },
    { id: '5', name: 'EEN', credits: 2 },
    { id: '6', name: 'EE', credits: 2 },
  ],
  2: [
    { id: '7', name: 'PS', credits: 4 },
    { id: '8', name: 'CA', credits: 4 },
    { id: '9', name: 'SS', credits: 4 },
    { id: '30', name: 'DSA', credits: 4 },
    { id: '10', name: 'OC', credits: 2 },
    { id: '11', name: 'FHVE', credits: 2 },
  ],
  3: [
    { id: '12', name: 'OS', credits: 4 },
    { id: '13', name: 'OOPS', credits: 4 },
    { id: '14', name: 'DBMS', credits: 4 },
    { id: '15', name: 'RANAC', credits: 4 },
    { id: '101', name: 'ADSA', credits: 4 },
    { id: '102', name: 'CCI', credits: 2 },
    { id: '103', name: 'PC', credits: 2 },
],
4: [
    { id: '16', name: 'CCN', credits: 4 },
    { id: '17', name: 'AI', credits: 4 },
    { id: '18', name: 'TOC', credits: 4 },
    { id: '20', name: 'FFSD', credits: 4 },
    { id: '104', name: 'IAE', credits: 2 },
    { id: '105', name: 'ACS', credits: 2 },
],
5: [
    { id: '21', name: 'ML', credits: 3 },
    { id: '22', name: 'IR', credits: 3 },
    { id: '23', name: 'FDFED', credits:4 },
    { id: '106', name: 'IDA', credits: 3 },
    { id: '107', name: 'CC', credits: 3 },
    { id: '108', name: 'QRA', credits: 2 },
    { id: '1089', name: 'DM', credits: 3 },
    { id: '24', name: 'SE', credits: 2 },
  ],
  6: [
    { id: '25', name: 'Cloud Computing', credits: 3 },
    { id: '26', name: 'Blockchain Technology', credits: 3 },
    { id: '27', name: 'Artificial Intelligence', credits: 3 },
    { id: '28', name: 'Big Data Analytics', credits: 3 },
  ],
  7: [
    { id: '25', name: 'IoT', credits: 3 },
    { id: '26', name: 'Embedded Systems', credits: 3 },
    { id: '27', name: 'Ethical Hacking', credits: 3 },
    { id: '28', name: 'Research Methodology', credits: 2 },
  ],
  8: [
    { id: '29', name: 'Project Work', credits: 6 },
    { id: '30', name: 'Internship', credits: 6 },
  ],
};

const initialSemesters = Array.from({ length: 8 }, (_, i) => ({
  semesterNumber: i + 1,
  subjects: semesterSubjects[i + 1] || [],
  grades: {},
  sgpa: 0,
}));

function App() {
  const dispatch = useDispatch();
  const semesters = useSelector((state) => state.grades.semesters) || initialSemesters;
  const currentSemester = useSelector((state) => state.grades.currentSemester) || 1;
  const cgpa = useSelector((state) => state.grades.cgpa) || 0; // Get CGPA from Redux

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await axios.get('http://localhost:9000/grade/getGrades', {
          withCredentials: true,
          params: { userId: 'USER_ID_HERE' }, // Replace with actual user ID
        });

        console.log('Raw response.data:', response.data);
        const backendSemesters = response.data.semesters || [];
        console.log('backendSemesters:', backendSemesters);

        const formattedSemesters = initialSemesters.map((sem) => {
          const backendSem = backendSemesters.find(
            (bs) => bs.semesterNumber === sem.semesterNumber
          );
          if (backendSem && backendSem.subjects && backendSem.subjects.length > 0) {
            const grades = backendSem.subjects.reduce((acc, subj) => {
              const subjectId = sem.subjects.find((s) => s.id === subj.id)?.id;
              if (subjectId) acc[subjectId] = subj.grade;
              return acc;
            }, {});
            return { ...sem, grades, sgpa: backendSem.sgpa };
          }
          return sem;
        });

        console.log('Formatted semesters:', formattedSemesters);
        dispatch(setGrades({ semesters: formattedSemesters, cgpa: response.data.cgpa || 0 }));
      } catch (error) {
        console.error('Error fetching grades:', error);
        if (error.response) {
          console.log('Error response:', error.response.data);
        }
      }
    };

    fetchGrades();
  }, [dispatch]);

  const handleGradeChange = (subjectId, grade) => {
    dispatch(updateGrade({ semesterNumber: currentSemester, subjectId, grade }));
  };

  const handleSaveGrades = async () => {
    const currentSemesterData = semesters.find(
      (sem) => sem.semesterNumber === currentSemester
    ) || { semesterNumber: currentSemester, grades: {}, subjects: [] };

    const formattedData = {
      semesterNumber: currentSemesterData.semesterNumber,
      subjects: currentSemesterData.subjects
        .map((subject) => {
          const grade = currentSemesterData.grades[subject.id];
          if (!grade) return null;
          return {
            id: subject.id,
            grade: grade.toUpperCase(),
            credits: subject.credits,
          };
        })
        .filter(Boolean),
    };

    if (formattedData.subjects.length === 0) {
      alert('No grades to save for this semester.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:9000/grade/save-grades',
        {
          semesterData: formattedData,
        },
        { withCredentials: true }
      );
      // Refetch grades to update SGPA and CGPA
      const fetchResponse = await axios.get('http://localhost:9000/grade/getGrades', {
        withCredentials: true,
        params: { userId: 'USER_ID_HERE' },
      });
      const backendSemesters = fetchResponse.data.semesters || [];
      const formattedSemesters = initialSemesters.map((sem) => {
        const backendSem = backendSemesters.find(
          (bs) => bs.semesterNumber === sem.semesterNumber
        );
        if (backendSem && backendSem.subjects && backendSem.subjects.length > 0) {
          const grades = backendSem.subjects.reduce((acc, subj) => {
            const subjectId = sem.subjects.find((s) => s.id === subj.id)?.id;
            if (subjectId) acc[subjectId] = subj.grade;
            return acc;
          }, {});
          return { ...sem, grades, sgpa: backendSem.sgpa };
        }
        return sem;
      });
      dispatch(setGrades({ semesters: formattedSemesters, cgpa: fetchResponse.data.cgpa || 0 }));
    } catch (error) {
      console.error('Error saving grades:', error);
      if (error.response) {
        alert('Failed to save grades: ' + (error.response.data.message || 'Unknown error'));
      } else if (error.request) {
        alert('Error saving grades: No response from server');
      } else {
        alert('Error saving grades: ' + error.message);
      }
    }
  };

  const handleLogout = () => {
    dispatch(resetGrades());
    localStorage.removeItem('userId');
    alert('Logged out successfully!');
  };

  const currentSemesterData = semesters.find(
    (sem) => sem.semesterNumber === currentSemester
  ) || { semesterNumber: currentSemester, subjects: [], grades: {}, sgpa: 0 };

  return (
    <div className="min-h-screen bg-[#F8F9FF]">
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Grade Management</h1>
            <p className="text-gray-600">Track and manage your academic performance across all semesters</p>
          </div>
          {/* <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
          >
            Logout
          </button> */}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-4 gap-4 mb-6">
            {semesters.map((sem) => (
              <button
                key={sem.semesterNumber}
                onClick={() => dispatch(setCurrentSemester(sem.semesterNumber))}
                className={`p-4 rounded-lg transition-all ${
                  currentSemester === sem.semesterNumber
                    ? 'bg-[#6366F1] text-white shadow-md'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="text-sm mb-1">Semester</div>
                <div className="text-2xl font-semibold">{sem.semesterNumber}</div>
              </button>
            ))}
          </div>

          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Subject</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Credits</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentSemesterData.subjects.map((subject) => (
                  <tr key={subject.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{subject.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{subject.credits}</td>
                    <td className="px-6 py-4">
                      <GradeSelect
                        value={currentSemesterData.grades[subject.id] || ''}
                        onChange={(grade) => handleGradeChange(subject.id, grade)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-between items-center">
            {/* <div>
              <p className="text-gray-700">SGPA: {currentSemesterData.sgpa}</p>
              <p className="text-gray-700">CGPA: {cgpa}</p>
            </div> */}
            <button
              onClick={handleSaveGrades}
              className="bg-[#6366F1] text-white px-6 py-2 rounded-lg hover:bg-[#4F46E5] transition-all"
            >
              Save
            </button>
          </div>
        </div>

            <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Semester Performance</h3>
                <ProgressBar value={currentSemesterData.sgpa} max={10} label="Semester GPA" />
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Overall Performance</h3>
                <ProgressBar value={cgpa} max={10} label="Cumulative GPA" />
            </div>
            </div> 
      </main>
    </div>
  );
}

export default App;







// import React from 'react';
// import { GradeSelect } from '../../components/Grade/GradeSelect';
// import { updateGrade, setGrades, setCurrentSemester } from '../../app/gradeSlice';
// import { useDispatch, useSelector } from 'react-redux';

// // Define semester subjects
// const semesterSubjects = {
//   1: [
//     { id: '1', name: 'DLD', credits: 4 },
//     { id: '2', name: 'OCW', credits: 4 },
//     { id: '3', name: 'CP', credits: 4 },
//     { id: '4', name: 'DSMA', credits: 4 },
//     { id: '5', name: 'EEN', credits: 2 },
//     { id: '6', name: 'EE', credits: 2 },
//   ],
//   2: [
//     { id: '7', name: 'PS', credits: 4 },
//     { id: '8', name: 'CA', credits: 4 },
//     { id: '9', name: '', credits: 4 },
//     { id: '10', name: '', credits: 2 },
//   ],
//   3: [
//     { id: '9', name: 'Discrete Mathematics', credits: 4 },
//     { id: '10', name: 'Object-Oriented Programming', credits: 3 },
//     { id: '11', name: 'Database Management Systems', credits: 3 },
//     { id: '12', name: 'Operating Systems', credits: 3 },
//   ],
//   4: [
//     { id: '13', name: 'Computer Networks', credits: 3 },
//     { id: '14', name: 'Algorithms', credits: 3 },
//     { id: '15', name: 'Software Engineering', credits: 3 },
//     { id: '16', name: 'Theory of Computation', credits: 3 },
//   ],
//   5: [
//     { id: '17', name: 'Machine Learning', credits: 3 },
//     { id: '18', name: 'Web Development', credits: 3 },
//     { id: '19', name: 'Cyber Security', credits: 3 },
//     { id: '20', name: 'Compiler Design', credits: 3 },
//   ],
//   6: [
//     { id: '21', name: 'Cloud Computing', credits: 3 },
//     { id: '22', name: 'Blockchain Technology', credits: 3 },
//     { id: '23', name: 'Artificial Intelligence', credits: 3 },
//     { id: '24', name: 'Big Data Analytics', credits: 3 },
//   ],
//   7: [
//     { id: '25', name: 'IoT', credits: 3 },
//     { id: '26', name: 'Embedded Systems', credits: 3 },
//     { id: '27', name: 'Ethical Hacking', credits: 3 },
//     { id: '28', name: 'Research Methodology', credits: 2 },
//   ],
//   8: [
//     { id: '29', name: 'Project Work', credits: 6 },
//     { id: '30', name: 'Internship', credits: 6 },
//   ],
// };

// // Initialize semesters with subjects included
// const initialSemesters = Array.from({ length: 8 }, (_, i) => ({
//   semesterNumber: i + 1,
//   subjects: semesterSubjects[i + 1] || [],
//   grades: {},
// }));

// function App() {
//   const dispatch = useDispatch();
//   const semesters = useSelector((state) => state.grades.semesters) || initialSemesters;
//   const currentSemester = useSelector((state) => state.grades.currentSemester) || 1;

//   const handleGradeChange = (subjectId, grade) => {
//     dispatch(updateGrade({ semesterNumber: currentSemester, subjectId, grade }));
//   };

//   const handleSaveGrades = async () => {
//     const currentSemesterData = semesters.find(
//       (sem) => sem.semesterNumber === currentSemester
//     ) || { semesterNumber: currentSemester, grades: {}, subjects: [] };

//     try {
//       const response = await fetch('/grade/save-grades', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(currentSemesterData),
//       });

//       if (response.ok) {
//         alert('Grades saved successfully!');
//       } else {
//         alert('Failed to save grades');
//       }
//     } catch (error) {
//       console.error('Error saving grades:', error);
//       alert('Error saving grades');
//     }
//   };

//   const currentSemesterData = semesters.find(
//     (sem) => sem.semesterNumber === currentSemester
//   ) || { semesterNumber: currentSemester, subjects: [], grades: {} };

//   return (
//     <div className="min-h-screen bg-[#F8F9FF]">
//       <main className="max-w-6xl mx-auto px-6 py-8">
//         <div className="mb-8">
//           <h1 className="text-2xl font-semibold text-gray-900 mb-2">Grade Management</h1>
//           <p className="text-gray-600">Track and manage your academic performance across all semesters</p>
//         </div>

//         <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
//           <div className="grid grid-cols-4 gap-4 mb-6">
//             {semesters.map((sem) => (
//               <button
//                 key={sem.semesterNumber}
//                 onClick={() => dispatch(setCurrentSemester(sem.semesterNumber))}
//                 className={`p-4 rounded-lg transition-all ${
//                   currentSemester === sem.semesterNumber
//                     ? 'bg-[#6366F1] text-white shadow-md'
//                     : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
//                 }`}
//               >
//                 <div className="text-sm mb-1">Semester</div>
//                 <div className="text-2xl font-semibold">{sem.semesterNumber}</div>
//               </button>
//             ))}
//           </div>

//           <div className="overflow-hidden rounded-lg border border-gray-200">
//             <table className="w-full">
//               <thead>
//                 <tr className="bg-gray-50">
//                   <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Subject</th>
//                   <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Credits</th>
//                   <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Grade</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {currentSemesterData.subjects.map((subject) => (
//                   <tr key={subject.id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 text-sm text-gray-900">{subject.name}</td>
//                     <td className="px-6 py-4 text-sm text-gray-600">{subject.credits}</td>
//                     <td className="px-6 py-4">
//                       <GradeSelect
//                         value={currentSemesterData.grades[subject.id] || ''}
//                         onChange={(grade) => handleGradeChange(subject.id, grade)}
//                       />
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           <div className="mt-4 flex justify-end">
//             <button
//               onClick={handleSaveGrades}
//               className="bg-[#6366F1] text-white px-6 py-2 rounded-lg hover:bg-[#4F46E5] transition-all"
//             >
//               Save
//             </button>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// export default App;






// import React, { useState } from 'react';
// import { GradeSelect } from '../../components/Grade/GradeSelect';
// import { ProgressBar } from '../../components/Grade/ProgressBar';
// // import { calculateSGPA, calculateCGPA } from '../../components/Grade/gradeCalculations';
// import { GraduationCap, Star, FileText, User } from 'lucide-react';

// // Mock data - In real app, this would come from backend
// // const mockSubjects = [
// //   { id: '1', name: 'Mathematics', credits: 4 },
// //   { id: '2', name: 'Physics', credits: 4 },
// //   { id: '3', name: 'Computer Science', credits: 3 },
// //   { id: '4', name: 'English', credits: 2 },
// // ];


// const semesterSubjects = {
//     1: [
//       { id: '1', name: 'DLD', credits: 4 },
//       { id: '2', name: 'OCW', credits: 4 },
//       { id: '3', name: 'CP', credits: 4 },
//       { id: '3', name: 'DSMA', credits: 4 },
//       { id: '4', name: 'EEN', credits: 2 },
//       { id: '5', name: 'EE', credits: 2 },
//     ],
//     2: [
//       { id: '5', name: 'PS', credits: 4 },
//       { id: '6', name: 'CA', credits: 4 },
//       { id: '7', name: '', credits: 4 },
//       { id: '8', name: '', credits: 2 },
//     ],
//     3: [
//       { id: '9', name: 'Discrete Mathematics', credits: 4 },
//       { id: '10', name: 'Object-Oriented Programming', credits: 3 },
//       { id: '11', name: 'Database Management Systems', credits: 3 },
//       { id: '12', name: 'Operating Systems', credits: 3 },
//     ],
//     4: [
//       { id: '13', name: 'Computer Networks', credits: 3 },
//       { id: '14', name: 'Algorithms', credits: 3 },
//       { id: '15', name: 'Software Engineering', credits: 3 },
//       { id: '16', name: 'Theory of Computation', credits: 3 },
//     ],
//     5: [
//       { id: '17', name: 'Machine Learning', credits: 3 },
//       { id: '18', name: 'Web Development', credits: 3 },
//       { id: '19', name: 'Cyber Security', credits: 3 },
//       { id: '20', name: 'Compiler Design', credits: 3 },
//     ],
//     6: [
//       { id: '21', name: 'Cloud Computing', credits: 3 },
//       { id: '22', name: 'Blockchain Technology', credits: 3 },
//       { id: '23', name: 'Artificial Intelligence', credits: 3 },
//       { id: '24', name: 'Big Data Analytics', credits: 3 },
//     ],
//     7: [
//       { id: '25', name: 'IoT', credits: 3 },
//       { id: '26', name: 'Embedded Systems', credits: 3 },
//       { id: '27', name: 'Ethical Hacking', credits: 3 },
//       { id: '28', name: 'Research Methodology', credits: 2 },
//     ],
//     8: [
//       { id: '29', name: 'Project Work', credits: 6 },
//       { id: '30', name: 'Internship', credits: 6 },
//     ],
//   };

// // Initialize all 8 semesters
// const initialSemesters = Array.from({ length: 8 }, (_, i) => ({
//   semesterNumber: i + 1,
//   subjects: semesterSubjects[i + 1] || [],
//   grades: {},
// }));

// function App() {
//   const [currentSemester, setCurrentSemester] = useState(1);
//   const [semesters, setSemesters] = useState(initialSemesters);

//   const handleGradeChange = (subjectId, grade) => {
//     setSemesters((prevSemesters) =>
//       prevSemesters.map((sem) =>
//         sem.semesterNumber === currentSemester
//           ? {
//               ...sem,
//               grades: { ...sem.grades, [subjectId]: grade },
//             }
//           : sem
//       )
//     );
//   };

//   const currentSemesterData = semesters.find(
//     (sem) => sem.semesterNumber === currentSemester
//   );
// //   const sgpa = calculateSGPA(currentSemesterData);
// //   const cgpa = calculateCGPA(semesters);

//   return (
//     <div className="min-h-screen bg-[#F8F9FF]">
//       {/* Header */}
//       {/* <header className="bg-white shadow-sm">
//         <div className="max-w-6xl mx-auto px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-2">
//               <GraduationCap className="w-8 h-8 text-[#6366F1]" />
//               <span className="text-xl font-semibold">ExamPrep</span>
//             </div>
//             <nav className="flex items-center space-x-6">
//               <a href="#" className="flex items-center space-x-1 text-gray-600 hover:text-[#6366F1]">
//                 <Star className="w-5 h-5" />
//                 <span>PYP</span>
//               </a>
//               <a href="#" className="flex items-center space-x-1 text-gray-600 hover:text-[#6366F1]">
//                 <FileText className="w-5 h-5" />
//                 <span>Grade Sheet</span>
//               </a>
//               <a href="#" className="flex items-center space-x-1 text-gray-600 hover:text-[#6366F1]">
//                 <User className="w-5 h-5" />
//                 <span>Profile</span>
//               </a>
//             </nav>
//           </div>
//         </div>
//       </header> */}

//       <main className="max-w-6xl mx-auto px-6 py-8">
//         <div className="mb-8">
//           <h1 className="text-2xl font-semibold text-gray-900 mb-2">Grade Management</h1>
//           <p className="text-gray-600">Track and manage your academic performance across all semesters</p>
//         </div>

//         {/* Semester Navigation */}
//         <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
//           <div className="grid grid-cols-4 gap-4 mb-6">
//             {semesters.map((sem) => (
//               <button
//                 key={sem.semesterNumber}
//                 onClick={() => setCurrentSemester(sem.semesterNumber)}
//                 className={`p-4 rounded-lg transition-all ${
//                   currentSemester === sem.semesterNumber
//                     ? 'bg-[#6366F1] text-white shadow-md'
//                     : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
//                 }`}
//               >
//                 <div className="text-sm mb-1">Semester</div>
//                 <div className="text-2xl font-semibold">{sem.semesterNumber}</div>
//               </button>
//             ))}
//           </div>

//           {/* Grades Table */}
//           <div className="overflow-hidden rounded-lg border border-gray-200">
//             <table className="w-full">
//               <thead>
//                 <tr className="bg-gray-50">
//                   <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Subject</th>
//                   <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Credits</th>
//                   <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Grade</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {currentSemesterData.subjects.map((subject) => (
//                   <tr key={subject.id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 text-sm text-gray-900">{subject.name}</td>
//                     <td className="px-6 py-4 text-sm text-gray-600">{subject.credits}</td>
//                     <td className="px-6 py-4">
//                       <GradeSelect
//                         value={currentSemesterData.grades[subject.id] || ''}
//                         onChange={(grade) => handleGradeChange(subject.id, grade)}
//                       />
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//            </table>
//           </div>
//         </div>

        {/* Progress Section */}
        //  <div className="grid grid-cols-2 gap-6">
        //   <div className="bg-white rounded-xl shadow-sm p-6">
        //     <h3 className="text-lg font-medium text-gray-900 mb-4">Semester Performance</h3>
        //     <ProgressBar value={sgpa} max={10} label="Semester GPA" />
        //   </div>
        //   <div className="bg-white rounded-xl shadow-sm p-6">
        //     <h3 className="text-lg font-medium text-gray-900 mb-4">Overall Performance</h3>
        //     <ProgressBar value={cgpa} max={10} label="Cumulative GPA" />
        //   </div>
        // </div> 
//       </main>
//     </div>
//   );
// }

// export default App;