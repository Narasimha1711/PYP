import React, { useState } from "react";
import { Calendar, ChevronDown, ChevronUp } from "lucide-react";
import ExamPaperList from "./ExamPaperList";

const YearPapers = ({ year, papers }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-8 py-6 flex items-center justify-between hover:bg-gray-50 transition-colors group"
      >
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 group-hover:bg-indigo-100 transition-colors">
            <Calendar size={24} />
          </div>
          <div className="text-left">
            <h3 className="text-2xl font-bold text-gray-900">{year}</h3>
            <p className="text-gray-500 text-sm mt-1">{papers.length} papers available</p>
          </div>
        </div>
        <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors">
          {isExpanded ? (
            <ChevronUp className="text-gray-600" size={20} />
          ) : (
            <ChevronDown className="text-gray-600" size={20} />
          )}
        </div>
      </button>
      {isExpanded && (
        <div className="px-8 pb-8 pt-2 bg-white">
          <ExamPaperList papers={papers} />
        </div>
      )}
    </div>
  );
};

export default YearPapers;
