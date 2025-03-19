import React from "react";
import { FileText } from "lucide-react";

const ExamPaperList = ({ papers }) => {
  return (
    <div className="space-y-4">
      {papers.map((paper, index) => (
        <a
          key={index}
          href={paper}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-all duration-200 group"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white rounded-lg shadow-sm group-hover:shadow transition-all">
              <FileText size={24} className="text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              Paper {index + 1}
            </h3>
          </div>
        </a>
      ))}
    </div>
  );
};

export default ExamPaperList;
