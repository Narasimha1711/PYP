const drive = require("../config/drive");
const credentials = require('../config/drive.json');
const { JWT } = require('google-auth-library');
const { google } = require('googleapis');
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

    await drive.permissions.create({
        fileId: fileId,
        requestBody: {
            role: "writer", // or "reader"
            type: "user",
            emailAddress: "rockynarasimha17@gmail.com",
        },
    })

    const file = await drive.files.get({
        fileId: fileId,
        fields: "webViewLink, webContentLink",
    });

    return file.data;
}

const jwtClient = new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/drive.metadata.readonly'],
  });
  
  async function checkStorage() {
    await jwtClient.authorize();
    const drive = google.drive({ version: 'v3', auth: jwtClient });
    const res = await drive.about.get({ fields: 'storageQuota' });
    console.log(res.data.storageQuota);
  }
  
  checkStorage();


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

        // await drive.permissions.create({
        //     fileId: folderId,
        //     requestBody: {
        //         role: "writer", // or "reader"
        //         type: "user",
        //         emailAddress: "rockynarasimha17@gmail.com",
        //     },
        // });

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


const deleteSpecificFilesInFolder = async (folderId, fileNamesToDelete) => {
    try {
        // List files in the specified folder
        const res = await drive.files.list({
            q: `'${folderId}' in parents and trashed = false`, // Filter by folder ID and non-trashed files
            fields: 'files(id, name)',  // Only retrieve file id and name
        });

        // Check if there are any files in the folder
        if (res.data.files.length === 0) {
            console.log('No files found in the folder.');
            return;
        }

        // Filter the files to delete based on the provided file names
        const filesToDelete = res.data.files.filter(file => fileNamesToDelete.includes(file.name));

        if (filesToDelete.length === 0) {
            console.log('No matching files found to delete.');
            return;
        }

        // Loop through selected files and delete them
        for (const file of filesToDelete) {
            try {
                await drive.files.delete({ fileId: file.id });
                console.log(`File deleted: ${file.name}`);
            } catch (error) {
                console.error(`Error deleting file ${file.name}:`, error.message);
            }
        }

        console.log('Selected files deleted successfully.');
    } catch (error) {
        console.error('Error listing files in folder:', error.message);
    }
};

const folderId = 'your-folder-id-here';  // Folder ID where your files are stored
const fileNamesToDelete = ['file1.pdf', 'file2.jpg'];  // List of filenames to delete
// deleteSpecificFilesInFolder(folderId, fileNamesToDelete);



module.exports = { testDrive, uploadFile, uploadDB, deleteSpecificFilesInFolder }