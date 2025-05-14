
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Signin from './pages/PYQ/Signin';
import SignUp from './pages/PYQ/Signup';
import PypHome from './pages/PYQ/PypHome';
import Header from './components/PYQ/Header';
import Upload from './pages/PYQ/Upload';
import ExamTypeView from './components/PYQ/ExamTypeView';
import ExamPapers from './components/PYQ/ExamPapers';
import GradeSheet from './pages/Grade/GradeSheet';
import UploadTimeTable from './pages/TimeTable/TimeTableUpload';
import UserTimeTable from './pages/TimeTable/UserTimeTable';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AppContent() {
  const location = useLocation();
  const hideHeader = ['/signin', '/signup'].includes(location.pathname);

  return (
    <>
      {!hideHeader && <Header />}
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/pyp" element={<PypHome />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/pyp/:subjectId" element={<ExamTypeView />} />
        <Route path="/pyp/:subjectId/:examType" element={<ExamPapers />} />
        <Route path="/grade" element={<GradeSheet />} />
        <Route path="/timetable/upload" element={<UploadTimeTable />} />
        <Route path="/timeTable" element={<UploadTimeTable />} />
        <Route path="/userTimeTable" element={<UserTimeTable />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <>
      <ToastContainer />
      <Router>
        <AppContent />
      </Router>
    </>
  );
}

export default App;



// import React from 'react';
// import { useState } from 'react'
// import './App.css'
// import Signin from './pages/PYQ/Signin'
// import {BrowserRouter as Router, Routes, Route, useLocation} from 'react-router-dom'
// import SignUp from './pages/PYQ/Signup'
// import PypHome from './pages/PYQ/PypHome'
// import Header from './components/PYQ/Header'
// import Upload from './pages/PYQ/Upload'
// import ExamTypeView from './components/PYQ/ExamTypeView';
// import ExamPapers from './components/PYQ/ExamPapers';
// import GradeSheet from './pages/Grade/GradeSheet';
// import UploadTimeTable from './pages/TimeTable/TimeTableUpload';
// import UserTimeTable from './pages/TimeTable/UserTimeTable';
// // import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// function App() {

//   const location = useLocation(); // Get current route
//   const hideHeader = ['/signin', '/signup'].includes(location.pathname); // Hide on signin/signup

//   return (
//     <>
//   {/* <ToastContainer> */}
      
//     <Router>
//       {/* <Header /> */}
//       <>
//       {!hideHeader && <Header />} {/* Conditionally render Header */}
//       <Routes>
//         {/* Public Routes */}
//         {/* <Route path="/" element={<Home />} /> */}
//         <Route path="/signup" element={<SignUp />} />
//         <Route path="/signin" element={<Signin />} />

//         {/* Protected Routes (Require Authentication) */}
//         <Route path="/pyp" element={<PypHome />}></Route>
//         <Route path="/upload" element={<Upload />}></Route>
//         <Route path="/pyp/:subjectId" element={<ExamTypeView />}></Route>
//         <Route path="/pyp/:subjectId/:examType" element={<ExamPapers />}></Route>

//         <Route path="/grade" element={<GradeSheet />}></Route>
//         <Route path="/timetable/upload" element={<UploadTimeTable />}></Route>

//         <Route path="/timeTable" element={<UploadTimeTable />} />
//         <Route path="/userTimeTable" element={<UserTimeTable />} />

  


//         {/* Catch-All 404 Page */}
//         {/* <Route path="*" element={<NotFound />} /> */}
//       </Routes>
//       </>
//     </Router>
//     {/* </ToastContainer> */}


//     </>
//   )
// }

// export default App
