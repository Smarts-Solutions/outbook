const multer = require('multer');
const path = require('path');

const Filter = (req, file, cb) => {
    const allowedMimeTypes = [
        'application/pdf',     
        'image/png',             
        'image/jpeg',            
        'application/msword',    
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
    ];

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
