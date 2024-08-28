const multer = require('multer');
const path = require('path');

const Filter = (req, file, cb) => {
   

    const allowedMimeTypes = [
        'application/pdf',       // PDF files
        'image/png',             // PNG images
        'image/jpeg',            // JPG and JPEG images
        'application/msword',    // DOC files
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // DOCX files
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only PDFs, DOCS, PNG, JPG, and JPEG are allowed."), false);
    }
};

const FilePath = path.join(__dirname, '../uploadFiles');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, FilePath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const uploadFile = multer({ storage: storage, fileFilter: Filter });

// Middleware to handle multiple files
const uploadMultiple = uploadFile.array('files[]', 20); // 'files' is the field name, 5 is the max file count

module.exports = uploadMultiple;
