import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GradeSelect } from '../../components/Grade/GradeSelect';
import { updateGrade, setGrades, setCurrentSemester, resetGrades } from '../../app/gradeSlice';
import { useDispatch, useSelector } from 'react-redux';
import { ProgressBar } from '../../components/Grade/ProgressBar';
import { useNavigate } from "react-router-dom";

// ErrorBoundary Component (unchanged)
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div className="text-red-500">Error loading progress bar</div>;
    }
    return this.props.children;
  }
}

// Define subjects for each branch
const branchSemesterSubjects = {
  CSE: {
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
      { id: '10', name: 'DSA', credits: 4 },
      { id: '11', name: 'OC', credits: 2 },
      { id: '12', name: 'FHVE', credits: 2 },
    ],
    3: [
      { id: '13', name: 'OS', credits: 4 },
      { id: '14', name: 'OOPS', credits: 4 },
      { id: '15', name: 'DBMS', credits: 4 },
      { id: '16', name: 'RANAC', credits: 4 },
      { id: '17', name: 'ADSA', credits: 4 },
      { id: '18', name: 'CCI', credits: 2 },
      { id: '19', name: 'PC', credits: 2 },
    ],
    4: [
      { id: '20', name: 'CCN', credits: 4 },
      { id: '21', name: 'AI', credits: 4 },
      { id: '22', name: 'TOC', credits: 4 },
      { id: '23', name: 'FFSD', credits: 4 },
      { id: '24', name: 'IAE', credits: 2 },
      { id: '25', name: 'ACS', credits: 2 },
    ],
    5: [
      { id: '26', name: 'ML', credits: 3 },
      { id: '27', name: 'IR', credits: 3 },
      { id: '28', name: 'FDFED', credits: 4 },
      { id: '29', name: 'IDA', credits: 3 },
      { id: '30', name: 'BTA', credits: 3 },
      { id: '31', name: 'CV', credits: 3 },
      { id: '32', name: 'CC', credits: 3 },
      { id: '33', name: 'ICS', credits: 3 },
      { id: '34', name: 'NLP', credits: 3 },
      { id: '35', name: 'QRA', credits: 2 },
      { id: '36', name: 'DM', credits: 3 },
      { id: '37', name: 'CGM', credits: 3 },
      { id: '38', name: 'SE', credits: 2 },
    ],
    6: [
      { id: '39', name: 'WBD', credits: 4 },
      { id: '40', name: 'DC', credits: 3 },
      { id: '41', name: 'HPC', credits: 3 },
      { id: '42', name: 'MS', credits: 3 },
      { id: '43', name: 'CGC', credits: 3 },
      { id: '44', name: 'GTA', credits: 3 },
      { id: '45', name: 'BI', credits: 3 },
      { id: '46', name: 'IS', credits: 3 },
      { id: '47', name: 'IASE', credits: 3 },
      { id: '48', name: 'DM', credits: 3 },
      { id: '49', name: 'MOT', credits: 3 },
      { id: '50', name: 'ADA', credits: 3 },
      { id: '51', name: 'DL', credits: 3 },
      { id: '52', name: 'BCI', credits: 3 },
      { id: '53', name: 'GEOTA', credits: 3 },
      { id: '54', name: 'IAS', credits: 3 },
      { id: '55', name: 'IoT', credits: 3 },
      { id: '56', name: 'PGP', credits: 2 },
      { id: '57', name: 'SE', credits: 2 },
      { id: '58', name: 'IAE', credits: 2 },
      
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
  },
  ECE: {
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
      { id: '8', name: 'BEC', credits: 4 },
      { id: '9', name: 'SS', credits: 4 },
      { id: '30', name: 'DSA', credits: 4 },
      { id: '10', name: 'OC', credits: 2 },
      { id: '11', name: 'FHVE', credits: 2 },
    ],
    3: [
      { id: '12', name: 'CNA', credits: 4 },
      { id: '13', name: 'OOPS', credits: 4 },
      { id: '14', name: 'CS', credits: 4 },
      { id: '15', name: 'RANAC', credits: 4 },
      { id: '101', name: 'ES', credits: 4 },
      { id: '102', name: 'CCI', credits: 2 },
      { id: '103', name: 'PC', credits: 2 },
    ],
    4: [
      { id: '16', name: 'CCN', credits: 4 },
      { id: '17', name: 'FCOMM', credits: 4 },
      { id: '18', name: 'EMTL', credits: 4 },
      { id: '20', name: 'AC', credits: 4 },
      { id: '104', name: 'IAE', credits: 2 },
      { id: '105', name: 'ACS', credits: 2 },
    ],
    5: [
      { id: '21', name: 'VLSI', credits: 4 },
      { id: '22', name: 'DSP', credits: 4 },
      { id: '23', name: 'MPMC', credits: 3 },
      { id: '106', name: 'PR', credits: 3 },
      { id: '106', name: 'WC', credits: 3 },
      { id: '1089', name: 'EP', credits: 3 },
      { id: '1089', name: 'IDA', credits: 3 },
      { id: '1089', name: 'ICPS', credits: 3 },
      { id: '108', name: 'QRA', credits: 2 },
      { id: '24', name: 'SE', credits: 2 },
    ],
    6: [
      { id: '25', name: 'ADA', credits: 3 },
      { id: '26', name: 'PDS', credits: 3 },
      { id: '27', name: 'ONE', credits: 3 },
      { id: '28', name: 'MSA', credits: 3 },
      { id: '28', name: 'MBSA', credits: 3 },
      { id: '28', name: 'PE', credits: 3 },
      { id: '28', name: 'HDL', credits: 3 },
      { id: '28', name: 'BCI', credits: 3 },
      { id: '28', name: 'GEOTA', credits: 3 },
      { id: '28', name: 'IAS', credits: 3 },
      { id: '28', name: 'IoT', credits: 3 },
      { id: '28', name: 'PGP', credits: 2 },
      { id: '28', name: 'SE', credits: 2 },
      { id: '28', name: 'IAE', credits: 2 },
    ],
    7: [
      { id: 'E30', name: 'Satellite Communication', credits: 4 },
      { id: 'E31', name: 'AI in Electronics', credits: 3 },
      { id: 'E32', name: 'Cybersecurity for IoT', credits: 3 },
      { id: 'E33', name: 'Research Methodology', credits: 2 },
    ],
    8: [
      { id: 'E34', name: 'Project Work', credits: 6 },
      { id: 'E35', name: 'Internship', credits: 6 },
    ],
  },
  // Add more branches as needed, e.g., MECH, EEE, etc.
};

// List of available branches
const branches = ['CSE', 'ECE'];

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const semesters = useSelector((state) => state.grades.semesters) || [];
  const currentSemester = useSelector((state) => state.grades.currentSemester) || 1;
  const cgpa = useSelector((state) => state.grades.cgpa) || 0;

  // State for selected branch
  const [selectedBranch, setSelectedBranch] = useState('CSE');

  // Initialize semesters based on the selected branch
  const initialSemesters = Array.from({ length: 8 }, (_, i) => ({
    semesterNumber: i + 1,
    subjects: branchSemesterSubjects[selectedBranch][i + 1] || [],
    grades: {},
    sgpa: 0,
  }));

  // Update semesters in Redux when branch changes
  useEffect(() => {
    dispatch(setGrades({ semesters: initialSemesters, cgpa: 0 }));
  }, [selectedBranch, dispatch]);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await axios.get('http://localhost:9000/grade/getGrades', {
          withCredentials: true,
          params: { userId: 'USER_ID_HERE', branch: selectedBranch }, // Pass branch to backend
        });

        const backendSemesters = response.data.semesters || [];
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

        dispatch(setGrades({ semesters: formattedSemesters, cgpa: response.data.cgpa || 0 }));
      } catch (error) {
        console.error('Error fetching grades:', error);
      }
    };

    fetchGrades();
  }, [dispatch, selectedBranch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:9000/pyp", {
          withCredentials: true,
        });
      } catch (error) {
        if (error?.response?.data?.message === "Unauthorized: No token provided") {
          navigate('/signin');
        }
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [navigate]);

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
      branch: selectedBranch, // Include branch in the payload
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
        params: { userId: 'USER_ID_HERE', branch: selectedBranch },
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
          {/* Branch Selection Dropdown */}
          <div>
            <label htmlFor="branch" className="mr-2 text-gray-600">Select Branch:</label>
            <select
              id="branch"
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="border border-gray-300 rounded-lg p-2"
            >
              {branches.map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </div>
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