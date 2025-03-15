const express = require("express");
const multer = require("multer");
const fs = require("fs");
const drive = require("../config/drive"); // Import Google Drive authentication
require("dotenv").config();
const { google } = require("googleapis");
const User = require('../models/User.js')

const router = express.Router();

async function makeFilePublic(fileId, userEmail) {
    await drive.permissions.create({
        fileId: fileId,
        requestBody: {
            role: "reader",  // Viewer role
            type: "anyone",  // Anyone can access
        },
        // requestBody: {
        //     role: "reader",  // Viewer role
        //     type: "user",  // specific access
        //     emailAddress: userEmail,
        // },
    });

    const file = await drive.files.get({
        fileId: fileId,
        fields: "webViewLink, webContentLink",
    });

    return file.data;
}


// 🔹 Function to get or create a folder in Google Drive
async function getOrCreateFolder(drive, folderName) {
    try {
        console.log(`🔍 Searching for folder: ${folderName}...`);
        const response = await drive.files.list({
            q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
            fields: "files(id, name)",
        });

        if (response.data.files.length > 0) {
            console.log(`✅ Folder found: ${folderName} (ID: ${response.data.files[0].id})`);
            return response.data.files[0].id;
        }

        console.log(`🚀 Creating folder: ${folderName}`);
        const fileMetadata = {
            name: folderName,
            mimeType: "application/vnd.google-apps.folder",
        };

        const folder = await drive.files.create({
            resource: fileMetadata,
            fields: "id",
        });

        console.log(`✅ Folder created with ID: ${folder.data.id}`);
        return folder.data.id;
    } catch (error) {
        console.error("❌ Error getting/creating folder:", error);
        throw error;
    }
}

// 🔹 Function to validate Google Drive API authentication
router.get("/test-auth", async (req, res) => {
    try {
        const response = await drive.files.list({ pageSize: 5, fields: "files(id, name)" });
        res.status(200).json({ message: "✅ Google Drive API authentication successful!", files: response.data.files });
    } catch (error) {
        console.error("🚨 Auth Error:", error);
        res.status(500).json({ error: "Google Drive API authentication failed.", details: error.message });
    }
});

// 🔹 Configure Multer for file upload
const upload = multer({ dest: "uploads/" });


router.post("/upload", upload.single("file"), async (req, res) => {
    try {
        const folderId = await getOrCreateFolder(drive, "PastPapers");

        if (!req.file) {
            return res.status(400).send("No file uploaded.");
        }

        const fileMetadata = {
            name: req.file.originalname,
            parents: [folderId],
        };

        const media = {
            mimeType: req.file.mimetype,
            body: fs.createReadStream(req.file.path),
        };

        const uploadedFile = await drive.files.create({
            requestBody: fileMetadata,
            media: media,
            fields: "id",
        });

        // Make the file public
        const publicFile = await makeFilePublic(uploadedFile.data.id);

        // const userId = req.user.userId;
        // const userEmail = await User.findById(userId);

        // if (!userEmail) {
        //     return res.status(400).send("User email is required.");
        // }

        // // Make sharable
        // const sharedFile = await shareFileWithUser(uploadedFile.data.id, userEmail);

        // Delete the file from local storage
        fs.unlinkSync(req.file.path);

        res.status(200).json({
            fileId: uploadedFile.data.id,
            viewLink: publicFile.webViewLink,
            downloadLink: publicFile.webContentLink,
            message: "File uploaded and made public successfully!",
        });
        // res.status(200).json({
        //     fileId: uploadedFile.data.id,
        //     viewLink: sharedFile.webViewLink,
        //     message: `File uploaded and shared with ${userEmail}!`,
        // });

    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).send("Error uploading file.");
    }
});


router.get("/files", async (req, res) => {
    try {
        const folderId = await getOrCreateFolder(drive, "PastPapers");

        const response = await drive.files.list({
            q: `'${folderId}' in parents and trashed=false`,
            fields: "files(id, name, webViewLink, webContentLink)",
        });

        if (response.data.files.length === 0) {
            return res.status(404).json({ message: "No files found in Google Drive folder." });
        }

        res.status(200).json(response.data.files);
    } catch (error) {
        console.error("Error retrieving files:", error);
        res.status(500).send("Error retrieving files.");
    }
});


module.exports = router;
