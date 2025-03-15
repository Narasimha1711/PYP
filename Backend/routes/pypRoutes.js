const express = require('express');
const router = express.Router();

const PypController = require("./controller/pypController");

router.get("/pyp",PypController);

module.exports = router;
