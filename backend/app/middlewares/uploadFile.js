const multer = require('multer');
const path = require('path');

const Filter = (req, file, cb) => {
    // const allowedMimeTypes = [
    //     'application/pdf',     
    //     'image/png',             
    //     'image/jpeg',            
    //     'application/msword',    
    //     'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
    // ];
    const allowedMimeTypes = 
    [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/png",
        "image/jpg",
        "image/jpeg",
        "message/rfc822", // For .eml
        "application/vnd.ms-outlook", // For .msg
        "application/mbox", // For .mbox
        "application/vnd.ms-outlook-pst", // For .pst
        "application/vnd.ms-outlook-ost", // For .ost
        "text/vcard", // For .vcf
        "text/calendar", // For .ics
        "application/vnd.ms-outlook-template", // For .oft
        "text/csv", // For .csv
        "application/vnd.ms-excel", // For .xls
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" // For .xlsx
    
      ]

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb({status:false,msg:"Invalid file type. Only PDFs, DOCS, PNG, JPG, and JPEG are allowed."}, false);
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



const uploadMultiple = uploadFile.array('files[]', 20); 

module.exports = uploadMultiple;
