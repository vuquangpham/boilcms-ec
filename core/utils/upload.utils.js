const multer = require('multer')
const fs = require("fs");

/**
 * Get file name and file extension
 * @param {Object} file
 * @return {Array}
 * */
const getFileNameAndExtension = (file) => {
    const fileOriginalNames = file.originalname.split('.');
    const fileExt = fileOriginalNames.slice(-1)[0];  // Get file extension
    const fileName = fileOriginalNames.slice(0)[0];

    return [fileName + '-' + Date.now(), fileExt]
}

/**
 * The disk storage engine gives you full control on storing files to disk.
 * https://github.com/expressjs/multer#storage
 * */
const storage = multer.diskStorage({
    // create destination folder
    destination: function (req, file, cb) {
        const date = new Date();
        const year = date.getFullYear().toString();
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const [fileName, fileExt] = getFileNameAndExtension(file)
        const destinationPath = `./public/upload/${year}/${month}/${fileName}`

        // custom metadata
        file.metadata = {}
        file.metadata.fileName = fileName;
        file.metadata.fileExt = fileExt;
        file.metadata.destinationDirectory = `upload/${year}/${month}/${fileName}`;

        // check if folder exists or not
        if (!fs.existsSync(destinationPath)) {
            fs.mkdirSync(destinationPath, {recursive: true})
        }
        cb(null, destinationPath)
    },

    // create file name
    filename: function (req, file, cb) {
        cb(null, file.metadata.fileName + '.' + file.metadata.fileExt)
    }
})

module.exports = multer({storage: storage})