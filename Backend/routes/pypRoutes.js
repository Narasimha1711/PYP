const express = require('express');
const router = express.Router();

const PypController = require("../controller/pypController");

router.get("/", PypController.sendInfo);
router.post("/addStarredSubject",PypController.addStarredSubject);
router.post("/deleteStarredSubject",PypController.deleteStarredSubject);
module.exports = router;