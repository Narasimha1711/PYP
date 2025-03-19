import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const ExamTypeView = () => {
  // console.log("ExamTypeView");
  const navigate = useNavigate();
  const { subjectId } = useParams(); // Extract subjectId and gateLink from the route

  const examTypes = ["mid1", "mid2", "end"];

  const handleNavigate = (examType) => {
    navigate(`/pyp/${subjectId}/${examType}`);
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 space-y-6">
      {/* Gate Questions Box */}
      <button
        onClick={() => window.open(gateLink, "_blank")}
        className="block w-full bg-indigo-600 text-white p-6 rounded-xl shadow-md hover:bg-indigo-700 transition"
      >
        Gate Questions
      </button>

      {/* Exam Type Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {examTypes.map((examType) => (
          <button
            key={examType}
            onClick={() => handleNavigate(examType)}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all hover:scale-[1.02]"
          >
            <h3 className="text-xl font-semibold text-gray-800">{examType.toUpperCase()}</h3>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExamTypeView;
