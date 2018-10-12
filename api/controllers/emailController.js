const nodemailer = require('nodemailer');

function sendEmail(sender, receiver, subject, message) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.email',
        port: 465,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'projectclzmate@gmail.com', // generated ethereal user
            pass: 'clzmatepassword12345' // generated ethereal password
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
            return { 'status': 'succsess' };
        }
    });

}
module.exports = {
    sendEmail: sendEmail
};