import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import YearPapers from "./YearPapers";

const ExamPapers = () => {
  const { subjectId, examType } = useParams(); // Extract subjectId & examType from URL
  // console.log(subjectId, examType);
  const [papersData, setPapersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const response = await fetch(`http://localhost:9000/pyp/papers/${subjectId}/${examType}`);
        if (!response.ok) throw new Error("Failed to fetch papers");

        const data = await response.json();
        setPapersData(data.papers);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, [subjectId, examType]);

  if (loading) return <div className="text-center mt-8 text-gray-600">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-8">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto mt-8 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 text-center">{examType.toUpperCase()} Papers</h2>
      {papersData.length === 0 ? (
        <div className="text-center text-gray-500">No papers available</div>
      ) : (
        papersData.map((yearData, index) => (
          <YearPapers key={index} year={yearData.year} papers={yearData.papers} />
        ))
      )}
    </div>
  );
};

export default ExamPapers;
