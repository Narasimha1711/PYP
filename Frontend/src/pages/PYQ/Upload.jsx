import React, { useState } from "react";
import axios from "axios";

export default function App() {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState("");

  const [form, setForm] = useState({
    subjectId: "",
    subject: "",
    year: "",
    typeExamination: "",
    papers: "",
  });

  const uploadFile = async () => {
    if (!file) return;
    
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post("http://localhost:9000/api/upload", formData);
      setFileUrl(res.data.viewLink);
      setForm((prev) => ({ ...prev, papers: res.data.viewLink }));
      console.log(res);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await axios.post("http://localhost:9000/api/uploadDB", form);
      console.log("Form Data:", form);
      // Show success message
      alert("Paper details submitted successfully!");
      // Reset form
      setForm({
        subjectId: "",
        subject: "",
        year: "",
        typeExamination: "",
        papers: "",
      });
      setFile(null);
      setFileUrl("");
      setFileName("");
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-indigo-600 py-4 px-6">
          <h1 className="text-2xl font-bold text-white">Paper Upload System</h1>
        </div>
        
        <div className="p-6">
          {/* File Upload Section */}
          <div className="mb-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Upload Examination Paper</h2>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-full">
                <label 
                  htmlFor="file-upload" 
                  className="flex justify-center items-center px-6 py-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <div className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-600">
                      {fileName ? fileName : "Drag and drop file or click to browse"}
                    </p>
                  </div>
                </label>
                <input 
                  id="file-upload" 
                  type="file" 
                  className="hidden" 
                  onChange={handleFileChange}
                />
              </div>
              
              <button
                className={`px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 ${
                  file ? "bg-indigo-600 text-white hover:bg-indigo-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                onClick={uploadFile}
                disabled={!file || isUploading}
              >
                {isUploading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </span>
                ) : "Upload File"}
              </button>
            </div>
            
            {fileUrl && (
              <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-md border border-green-200">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-medium">File uploaded successfully!</span>
                </div>
                <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 text-sm mt-1 inline-block">
                  View uploaded file
                </a>
              </div>
            )}
          </div>
          
          {/* Paper Details Form */}
          <form onSubmit={handleSubmit}>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Paper Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="subjectId" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject ID
                </label>
                <input
                  id="subjectId"
                  type="text"
                  value={form.subjectId}
                  onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., COMP101"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject Name
                </label>
                <input
                  id="subject"
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., Computer Science"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                  Year
                </label>
                <input
                  id="year"
                  type="text"
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., 2025"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="typeExamination" className="block text-sm font-medium text-gray-700 mb-1">
                  Examination Type
                </label>
                <input
                  id="typeExamination"
                  type="text"
                  value={form.typeExamination}
                  onChange={(e) => setForm({ ...form, typeExamination: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., Midterm, Final, Quiz"
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end mt-8">
              <button
                type="submit"
                disabled={!fileUrl || isSubmitting}
                className={`px-6 py-3 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 ${
                  fileUrl ? "bg-indigo-600 text-white hover:bg-indigo-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : "Submit Paper Details"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}