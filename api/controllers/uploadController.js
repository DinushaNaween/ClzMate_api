const multer = require('multer');

const userImageStorage = multer.diskStorage({
    destination: function(req, file, cd) {
        cd(null, 'uploads/userImages');
    },
    filename: function(req, file, cd) {
        cd(null, Date.now()+'-'+ file.originalname)
    }
});

const userImageUpload = multer({ storage: userImageStorage });

module.exports = {
    userImageUpload: userImageUpload
};