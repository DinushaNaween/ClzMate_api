const nodemailer = require('nodemailer');
const userController = require('./userController');

function sendVerificationCode(receiver, verificationCode) {
    const sender = 'projectclzmate@gmail.com';
    const subject = 'Reset ClzMate Password';
    
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'projectclzmate@gmail.com',
            pass: 'clzmate12345pass'
        }
    });

    const mailOptions = {
        from: sender,
        to: receiver,
        subject: subject,
        html: '<h1>Welcome to ClzMate Password Reset, </h1><p>Your verification code for reset password is </p>' + verificationCode
    };

    transporter.sendMail(mailOptions, function (error, info) {
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

function sendNewPassword(receiver, newpassword) {
    const sender = 'projectclzmate@gmail.com';
    const subject = 'Reset ClzMate Password';
    
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'projectclzmate@gmail.com',
            pass: 'clzmate12345pass'
        }
    });

    const mailOptions = {
        from: sender,
        to: receiver,
        subject: subject,
        html: '<h1>Welcome to ClzMate, </h1><p>Your new password is </p>' + newpassword
    };

    transporter.sendMail(mailOptions, function (error, info) {
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
    sendVerificationCode: sendVerificationCode,
    sendNewPassword: sendNewPassword
};