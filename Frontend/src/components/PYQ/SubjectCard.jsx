import React from "react";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SubjectCard = ({ subject, isStarred, onStarToggle }) => {
  // console.log(subject);
  const navigate = useNavigate();

  const handleViewPapers = () => {
    const route = `/pyp/${subject.subjectId}`;
    navigate(route);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-semibold text-gray-800">{subject.subject}</h3>
        <button
          onClick={() => onStarToggle(subject.subjectId)}
          className={`p-1.5 rounded-full transition-colors ${
            isStarred
              ? "text-yellow-400 hover:text-yellow-500"
              : "text-gray-300 hover:text-gray-400"
          }`}
        >
          <Star fill={isStarred ? "currentColor" : "none"} size={20} />
        </button>
      </div>
      <button
        onClick={handleViewPapers}
        className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
      >
        View Papers
      </button>
    </div>
  );
};

export default SubjectCard;
