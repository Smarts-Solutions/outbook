const fs = require('fs');
const path = require('path');

const deleteUploadFile = (filename) => {
    const filePath = path.join(__dirname, '../uploadFiles', filename);
    
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error(`Failed to delete file: ${err.message}`);
        } else {
            console.log(`File deleted: ${filename}`);
        }
    });
};

module.exports = deleteUploadFile;