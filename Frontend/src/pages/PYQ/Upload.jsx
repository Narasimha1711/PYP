
import React, { useState } from "react";
import axios from "axios";

export default function App() {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");

  const [form, setForm] = useState({
    subjectId: "",
    subject: "",
    year: "",
    typeExamination: "",
    papers: "",
  });

  const uploadFile = async () => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await axios.post("http://localhost:9000/api/upload", formData);
    setFileUrl(res.data.viewLink);
    setForm((prev) => ({ ...prev, papers: res.data.viewLink }));
    console.log(res);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post("http://localhost:9000/api/uploadDB", form);
    console.log("Form Data:", form);
  };

  return (
    <div className="p-5">
      <h2>Upload File</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={uploadFile}>Upload</button>
      {fileUrl && <p>File uploaded: <a href={fileUrl} target="_blank" rel="noreferrer">{fileUrl}</a></p>}

      <h2 className="mt-4">Enter Paper Details</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input placeholder="Subject ID" onChange={(e) => setForm({ ...form, subjectId: e.target.value })} />
        <input placeholder="Subject" onChange={(e) => setForm({ ...form, subject: e.target.value })} />
        <input placeholder="Year" onChange={(e) => setForm({ ...form, year: e.target.value })} />
        <input placeholder="Exam Type" onChange={(e) => setForm({ ...form, typeExamination: e.target.value })} />
        <input placeholder="File Link" value={form.papers} readOnly />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
