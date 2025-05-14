const express = require('express');
const router = express.Router();
const TimeTableController = require('../controller/timeTableController')

router.get('/getTimeTable',TimeTableController.getTimetable);
router.post('/upload',TimeTableController.uploadTimetable);
router.delete('/deleteTimeTable',TimeTableController.deleteTimetable);





module.exports = router;