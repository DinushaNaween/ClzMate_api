const nodemailer = require('nodemailer');
const userController = require('./userController');

function sendEmail(receiver, verificationCode) {
    const sender = 'clzmatetool@gmail.com';
    const subject = 'Reset ClzMate Password';
    
    const smtptransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'dldndasanayaka@gmail.com',
            pass: '123tagwaymouse123tagwaymouse'
        }
    });

    const mailOptions = {
        from: sender,
        to: receiver,
        subject: subject,
        html: '<h1>Welcome to ClzMate, </h1><p>Your verification code for reset password is </p>' + verificationCode
    };

    smtptransporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('error');
            console.log(error);
            throw new Error('email sending failed'); 
            
        } else {
            res.status(200).json({
                state: true
            })
        }
    });

}
module.exports = { 
    sendEmail: sendEmail
};