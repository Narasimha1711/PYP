const express = require('express');
const { saveGrades, getGrades } = require('../controller/gradesController');
const jwtMiddleware = require('../middleware/jwt');
const router = express.Router();



router.post('/save-grades', jwtMiddleware, saveGrades)
router.get('/getGrades', jwtMiddleware, getGrades)


module.exports = router;

