import React, { useState } from 'react';
import { GradeSelect } from './components/GradeSelect';
import { ProgressBar } from './components/ProgressBar';
import { calculateSGPA, calculateCGPA } from './utils/gradeCalculations';
import { GraduationCap, Star, FileText, User } from 'lucide-react';

// Mock data - In real app, this would come from backend
const mockSubjects = [
  { id: '1', name: 'Mathematics', credits: 4 },
  { id: '2', name: 'Physics', credits: 4 },
  { id: '3', name: 'Computer Science', credits: 3 },
  { id: '4', name: 'English', credits: 2 },
];

// Initialize all 8 semesters
const initialSemesters = Array.from({ length: 8 }, (_, i) => ({
  semesterNumber: i + 1,
  subjects: mockSubjects,
  grades: {},
}));

function App() {
  const [currentSemester, setCurrentSemester] = useState(1);
  const [semesters, setSemesters] = useState(initialSemesters);

  const handleGradeChange = (subjectId, grade) => {
    setSemesters((prevSemesters) =>
      prevSemesters.map((sem) =>
        sem.semesterNumber === currentSemester
          ? {
              ...sem,
              grades: { ...sem.grades, [subjectId]: grade },
            }
          : sem
      )
    );
  };

  const currentSemesterData = semesters.find(
    (sem) => sem.semesterNumber === currentSemester
  );
  const sgpa = calculateSGPA(currentSemesterData);
  const cgpa = calculateCGPA(semesters);

  return (
    <div className="min-h-screen bg-[#F8F9FF]">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <GraduationCap className="w-8 h-8 text-[#6366F1]" />
              <span className="text-xl font-semibold">ExamPrep</span>
            </div>
            <nav className="flex items-center space-x-6">
              <a href="#" className="flex items-center space-x-1 text-gray-600 hover:text-[#6366F1]">
                <Star className="w-5 h-5" />
                <span>PYP</span>
              </a>
              <a href="#" className="flex items-center space-x-1 text-gray-600 hover:text-[#6366F1]">
                <FileText className="w-5 h-5" />
                <span>Grade Sheet</span>
              </a>
              <a href="#" className="flex items-center space-x-1 text-gray-600 hover:text-[#6366F1]">
                <User className="w-5 h-5" />
                <span>Profile</span>
              </a>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Grade Management</h1>
          <p className="text-gray-600">Track and manage your academic performance across all semesters</p>
        </div>

        {/* Semester Navigation */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-4 gap-4 mb-6">
            {semesters.map((sem) => (
              <button
                key={sem.semesterNumber}
                onClick={() => setCurrentSemester(sem.semesterNumber)}
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

          {/* Grades Table */}
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
        </div>

        {/* Progress Section */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Semester Performance</h3>
            <ProgressBar value={sgpa} max={10} label="Semester GPA" />
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