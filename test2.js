// const nodemailer = require('nodemailer');

// function sendEmail(sender, receiver, subject, message) {
//     const transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//             user: 'projectclzmate@gmail.com',
//             pass: 'clzmatepassword12345'
//         }
//     });

//     const mailOptions = {
//         from: sender,
//         to: receiver,
//         subject: subject,
//         text: message
//     };

//     transporter.sendMail(mailOptions, function (error, info) {
//         if (error) {
//             console.log('error');
//             console.log(error);
//             throw new Error('email sending failed');
            
//         } else {
//             return { 'status': 'succsess' };
//         }
//     });

// }
// module.exports = {
//     sendEmail: sendEmail
// };