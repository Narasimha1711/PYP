import React from 'react';
import { useState } from 'react'
import './App.css'
import Signin from './pages/PYQ/Signin'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import SignUp from './pages/PYQ/Signup'
import PypHome from './pages/PYQ/PypHome'
import Header from './components/PYQ/Header'
import Upload from './pages/PYQ/Upload'
import ExamTypeView from './components/PYQ/ExamTypeView';
import ExamPapers from './components/PYQ/ExamPapers';
function App() {

  return (
    <>

    <Router>
      <Header />
      <Routes>
        {/* Public Routes */}
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<Signin />} />

        {/* Protected Routes (Require Authentication) */}
        <Route path="/pyp" element={<PypHome />}></Route>
        <Route path="/upload" element={<Upload />}></Route>
        <Route path="/pyp/:subjectId" element={<ExamTypeView />}></Route>
        <Route path="/pyp/:subjectId/:examType" element={<ExamPapers />}></Route>


        {/* Catch-All 404 Page */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Router>


    </>
  )
}

export default App
