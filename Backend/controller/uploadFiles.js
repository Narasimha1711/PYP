const drive = require("../config/drive");
const fs = require("fs");
const PastYearPapers = require('../models/PastYearPapers');
async function makeFilePublic(fileId, userEmail) {
    await drive.permissions.create({
        fileId: fileId,
        requestBody: {
            role: "reader",  // Viewer role
            type: "anyone",  // Anyone can access
        },
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



const testDrive = async (req, res) => {
    try {
        const response = await drive.files.list({ pageSize: 5, fields: "files(id, name)" });
        res.status(200).json({ message: "✅ Google Drive API authentication successful!", files: response.data.files });
    } catch (error) {
        console.error("🚨 Auth Error:", error);
        res.status(500).json({ error: "Google Drive API authentication failed.", details: error.message });
    }
}

const uploadFile = async (req, res) => {
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

        fs.unlinkSync(req.file.path);

        res.status(200).json({
            fileId: uploadedFile.data.id,
            viewLink: publicFile.webViewLink,
            downloadLink: publicFile.webContentLink,
            message: "File uploaded and made public successfully!",
        });

    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).send("Error uploading file.");
    }
}

const uploadDB = async(req, res) => {

    try {
        const { subjectId, subject, typeExamination, year, papers } = req.body;

        // Find or create the document
        let pastPaper = await PastYearPapers.findOne({ subjectId});

        if (!pastPaper) {
            // Create a new document if it doesn't exist
            pastPaper = new PastYearPapers({
                subjectId,
                subject,
                [typeExamination]: [{ year, papers }]
            });

            await pastPaper.save();
            return res.status(201).json({ message: "New subject created with exam papers", pastPaper });
        }
        else {
            pastPaper[typeExamination].push({ year, papers });
        }

        // Check if the typeExamination array exists
        if (!pastPaper[typeExamination]) {
            pastPaper[typeExamination] = [];
        }

        // Find the year inside the typeExamination array
        let examForYear = pastPaper[typeExamination].find(exam => exam.year === year);

        if (!examForYear) {
            // If year is not found, create a new entry for the year
            pastPaper[typeExamination].push({ year, papers });
        } else {
            // If year exists, add new papers to the array (avoid duplicates)
            examForYear.papers = [...new Set([...examForYear.papers, ...papers])];
        }

        await pastPaper.save();
        res.status(200).json({ message: "Exam papers updated successfully", pastPaper });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }


}


module.exports = { testDrive, uploadFile, uploadDB }