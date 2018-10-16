// const nodemailer=require('nodemailer');



// var transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: 'projectclzmate@gmail.com',
//       pass: 'clzmatepassword12345'
//     }
//   });


// module.exports.getname=(req,res,next)=>{
//     User.findOne({email:req.params.email}).select().exec((err,user)=>{
//         console.log(bcrypt.getRounds(user.password))
//             if(!user){ console.log('svdjsdj')
//                 res.json({sucsess:false,message:'email was not found'})
//             }
    
//             else{ 
//                 var email={
//                     from:'',
//                     to:'',
//                     subject:user.firstName,
//                     text:bcrypt.getRounds(user.password)
//                 };
//                 transporter.sendMail(email, function(error, info){
//                     if (error) {
//                       console.log(error);
//                     } else {
//                       console.log('Email sent: ' + info.response);
//                     }
//                   });
//                   return res.status(200).json({ status: true, user});
//             }
        
        
//     })
// }