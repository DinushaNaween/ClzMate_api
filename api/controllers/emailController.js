const nodemailer = require('nodemailer');

function sendEmail(receiver) {
    const sender = 'projectclzmate@gmail.com';
    const subject = 'Reset ClzMate Password';
    const message = '<html><body><h1>This is h1 tag</h1></body></html>';

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'projectclzmate@gmail.com',
            pass: 'clzmatepassword12345'
        }
    });

    const mailOptions = {
        from: sender,
        to: receiver,
        subject: subject,
        text: message
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
    sendEmail: sendEmail
};