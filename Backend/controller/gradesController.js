const express = require('express');
const User = require('../models/User');

const gradePoints = {
    O: 10,
    A: 9,
    B: 8,
    C: 7,
    D: 6,
    P: 5,
    F: 0,
  };


  const calculateSGPA = (subjects) => {
    if (!subjects || subjects.length === 0) return 0;
  
    const totalPoints = subjects.reduce((sum, subject) => {
      const points = gradePoints[subject.grade] || 0;
      return sum + points * subject.credits;
    }, 0);
  
    const totalCredits = subjects.reduce((sum, subject) => sum + subject.credits, 0);
    return totalCredits > 0 ? (totalPoints / totalCredits) : 0;
  };


  const calculateCGPA = (semesters) => {
    if (!semesters || semesters.length === 0) return 0;
  
    let totalPoints = 0;
    let totalCredits = 0;
  
    semesters.forEach((semester) => {
      if (semester.subjects && semester.subjects.length > 0) {
        semester.subjects.forEach((subject) => {
          const points = gradePoints[subject.grade] || 0;
          totalPoints += points * subject.credits;
          totalCredits += subject.credits;
        });
      }
    });
  
    return totalCredits > 0 ? (totalPoints / totalCredits) : 0;
  };


const saveGrades = async(req, res) => {
    const { semesterData } = req.body;
    // console.log(req.user);
    console.log(semesterData)
    // console.log(req.body);
    if (!semesterData || !semesterData.semesterNumber || !semesterData.subjects) {
        return res.status(400).json({ message: 'Missing required fields: userId or semesterData' });
      }

      try {
        const user = await User.findById(req.user.userId);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        // Check if the semester already exists in the user's semesters array
        const existingSemesterIndex = user.semesters.findIndex(
          (sem) => sem.semesterNumber === semesterData.semesterNumber
        );
    
        if (existingSemesterIndex !== -1) {
          // Update existing semester
          user.semesters[existingSemesterIndex].subjects = semesterData.subjects;
        } else {
          // Add new semester
          user.semesters.push(semesterData);
        }
        // Save the updated user document
        await user.save();
    
        res.status(200).json({ message: 'Grades saved successfully' });
      } catch (error) {
        console.error('Error saving grades:', error);
        res.status(500).json({ message: 'Server error while saving grades', error: error.message });
      }
}


const getGrades = async (req, res) => {

    const userId = req.user.userId;

    try {
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }

        const semesters = user.semesters || [];
        
        const responseData = {
            semesters: semesters.map((sem) => ({
              semesterNumber: sem.semesterNumber,
              subjects: sem.subjects,
              sgpa: calculateSGPA(sem.subjects), // Calculate SGPA for each semester
            })),
            cgpa: calculateCGPA(semesters), // Calculate CGPA across all semesters
          };

        res.status(200).json(responseData);
    }
    catch {
        console.error('Error getting grades:', error);
        res.status(500).json({ message: 'Server error while gettig grades', error: error.message });
    }
}



module.exports = { saveGrades, getGrades };