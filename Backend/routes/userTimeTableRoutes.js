const express = require('express');
const router = express.Router();
const UserTimeTableController = require('../controller/userTimeTableController')

router.get("/getUserTimeTable",UserTimeTableController.getUserTimeTable);
router.post("/submitUserTimeTableSubjects",UserTimeTableController.submitUserTimeTableSubjects);
router.delete("/deleteUserTimeTable",UserTimeTableController.deleteUserTimeTable);
router.get("/getUserNextClass",UserTimeTableController.getUserNextClass);

module.exports = router;