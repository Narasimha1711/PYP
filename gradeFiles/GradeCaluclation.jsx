// const gradePoints = {
//     'O': 10,
//     'A': 9,
//     'B': 8,
//     'C': 7,
//     'D': 6,
//     'P': 5,
//   };
  
//   export const calculateSGPA = (semesterData) => {
//     if (!semesterData) return 0;
    
//     let totalCredits = 0;
//     let totalGradePoints = 0;
  
//     semesterData.subjects.forEach((subject) => {
//       const grade = semesterData.grades[subject.id];
//       if (grade && grade in gradePoints) {
//         totalCredits += subject.credits;
//         totalGradePoints += subject.credits * gradePoints[grade];
//       }
//     });
  
//     return totalCredits === 0 ? 0 : (totalGradePoints / totalCredits);
//   };
  
//   export const calculateCGPA = (semesters) => {
//     if (!semesters || !semesters.length) return 0;
  
//     let totalCredits = 0;
//     let totalGradePoints = 0;
  
//     semesters.forEach((semester) => {
//       semester.subjects.forEach((subject) => {
//         const grade = semester.grades[subject.id];
//         if (grade && grade in gradePoints) {
//           totalCredits += subject.credits;
//           totalGradePoints += subject.credits * gradePoints[grade];
//         }
//       });
//     });
  
//     return totalCredits === 0 ? 0 : (totalGradePoints / totalCredits);
//   };