const express = require("express");
const multer = require("multer");
const fs = require("fs");
const drive = require("../config/drive"); // Import Google Drive authentication
require("dotenv").config();
const { google } = require("googleapis");
const User = require('../models/User.js')

const router = express.Router();

const { testDrive, uploadFile, uploadDB, deleteSpecificFilesInFolder } = require('../controller/uploadFiles.js');

// 🔹 Function to validate Google Drive API authentication
router.get("/test-auth", testDrive);

// 🔹 Configure Multer for file upload
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), uploadFile);



// router.get("/files", async (req, res) => {
//     try {
//         const folderId = await getOrCreateFolder(drive, "PastPapers");

//         const response = await drive.files.list({
//             q: `'${folderId}' in parents and trashed=false`,
//             fields: "files(id, name, webViewLink, webContentLink)",
//         });

//         if (response.data.files.length === 0) {
//             return res.status(404).json({ message: "No files found in Google Drive folder." });
//         }

//         res.status(200).json(response.data.files);
//     } catch (error) {
//         console.error("Error retrieving files:", error);
//         res.status(500).send("Error retrieving files.");
//     }
// });

router.post('/uploadDB', uploadDB);


module.exports = router;
