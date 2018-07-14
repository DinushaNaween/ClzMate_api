const multer = require('multer');

const userImageUploadPath = '../uploads/userimages';

const userImageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, userImageUploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now()+'-'+file.originalname);
    }
});

const userImageUpload = multer({ storage: userImageStorage });

const userImageUploader = userImageUpload.fields([{ name: 'userImage', maxCount: 1 }]);

module.exports = {
    userImageUploader: userImageUploader
};