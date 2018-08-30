const multer = require('multer');

//const adminImageUploadPath = require('uploads/adminImages');
//const studentImageUploadPath = require('uploads/studentImages');
//const teacherImageUploadPath = require('uploads/teacherImages');
//const cardMakerImageUploadPath = require('uploads/cardMakerImages');

const userImageStorage = multer.diskStorage({
    destination: function(req, file, cd) {
        cd(null, 'uploads/studentImages');
    },
    filename: function(req, file, cd) {
        cd(null, Date.now()+'-'+ file.originalname)
    }
});

const userImageUpload = multer({ storage: userImageStorage });

module.exports = {
    userImageUpload: userImageUpload
};