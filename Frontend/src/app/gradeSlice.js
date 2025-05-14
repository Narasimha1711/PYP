import { createSlice } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

// Helper function to deep clone an object to ensure it's extensible
const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

const persistConfig = {
  key: 'grades',
  storage,
};

const semesterSubjects = {
    1: [
        { id: '1', name: 'DLD', credits: 4 },
        { id: '2', name: 'OCW', credits: 4 },
        { id: '3', name: 'CP', credits: 4 },
        { id: '4', name: 'DSMA', credits: 4 },
        { id: '5', name: 'EEN', credits: 2 },
        { id: '6', name: 'EE', credits: 2 },
      ],
      2: [
        { id: '7', name: 'PS', credits: 4 },
        { id: '8', name: 'CA', credits: 4 },
        { id: '9', name: 'SS', credits: 4 },
        { id: '30', name: 'DSA', credits: 4 },
        { id: '10', name: 'OC', credits: 2 },
        { id: '11', name: 'FHVE', credits: 2 },
      ],
      3: [
        { id: '12', name: 'OS', credits: 4 },
        { id: '13', name: 'OOPS', credits: 4 },
        { id: '14', name: 'DBMS', credits: 4 },
        { id: '15', name: 'RANAC', credits: 4 },
        { id: '101', name: 'ADSA', credits: 4 },
        { id: '102', name: 'CCI', credits: 2 },
        { id: '103', name: 'PC', credits: 2 },
    ],
    4: [
        { id: '16', name: 'CCN', credits: 4 },
        { id: '17', name: 'AI', credits: 4 },
        { id: '18', name: 'TOC', credits: 4 },
        { id: '20', name: 'FFSD', credits: 4 },
        { id: '104', name: 'IAE', credits: 2 },
        { id: '105', name: 'ACS', credits: 2 },
    ],
    5: [
        { id: '21', name: 'ML', credits: 3 },
        { id: '22', name: 'IR', credits: 3 },
        { id: '23', name: 'FDFED', credits: 4 },
        { id: '106', name: 'IDA', credits: 3 },
        { id: '107', name: 'CC', credits: 3 },
        { id: '108', name: 'QRA', credits: 2 },
        { id: '1089', name: 'DM', credits: 3 },
        { id: '24', name: 'SE', credits: 2 },
      ],
  6: [
    { id: '21', name: 'Cloud Computing', credits: 3 },
    { id: '22', name: 'Blockchain Technology', credits: 3 },
    { id: '23', name: 'Artificial Intelligence', credits: 3 },
    { id: '24', name: 'Big Data Analytics', credits: 3 },
  ],
  7: [
    { id: '25', name: 'IoT', credits: 3 },
    { id: '26', name: 'Embedded Systems', credits: 3 },
    { id: '27', name: 'Ethical Hacking', credits: 3 },
    { id: '28', name: 'Research Methodology', credits: 2 },
  ],
  8: [
    { id: '29', name: 'Project Work', credits: 6 },
    { id: '30', name: 'Internship', credits: 6 },
  ],
};

const initialState = {
  semesters: Array.from({ length: 8 }, (_, i) => ({
    semesterNumber: i + 1,
    subjects: semesterSubjects[i + 1] || [],
    grades: {},
    sgpa: 0,
  })),
  currentSemester: 1,
  cgpa: 0, // Add CGPA to state
};

const gradesSlice = createSlice({
  name: 'grades',
  initialState,
  reducers: {
    updateGrade: (state, action) => {
      const { semesterNumber, subjectId, grade } = action.payload;
      if (!state.semesters || !Array.isArray(state.semesters)) {
        state.semesters = deepClone(initialState.semesters);
      }
      const semester = state.semesters.find((sem) => sem.semesterNumber === semesterNumber);
      if (semester) {
        semester.grades[subjectId] = grade;
      }
    },
    setGrades: (state, action) => {
      const { semesters, cgpa } = action.payload;
      state.semesters = deepClone(semesters);
      state.cgpa = cgpa; // Update CGPA
    },
    setCurrentSemester: (state, action) => {
      state.currentSemester = action.payload;
    },
    resetGrades: (state) => {
      return initialState; // Reset everything, including CGPA
    },
  },
});

export const { updateGrade, setGrades, setCurrentSemester, resetGrades } = gradesSlice.actions;
export const gradesReducer = persistReducer(persistConfig, gradesSlice.reducer);
export default gradesReducer;