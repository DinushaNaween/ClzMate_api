// docs => { 
//     console.log(docs);
//         res.status(200).json({
//             Users: docs.map(doc => {
//                 return{
//                     UserId: doc._id,
//                     First_Name: doc.firstName,
//                     Last_Name: doc.lastName,
//                     Email: doc.email,
//                     Birthday: doc.birthday,
//                     Batch: doc.batch,
//                     Role: doc.role,
//                     Full_Name: doc.fullName,
//                     Subjects: doc.subjects,
//                     School: doc.school,
//                     AddressId: doc.address._id,
//                     First_Line: doc.address.firstLine,
//                     Second_Line: doc.address.secondLine,
//                     City: doc.address.city,
//                     District: doc.address.district,
//                     ContactDetailsId: doc.contactDetails._id,
//                     Land_Number: doc.contactDetails.landNumber,
//                     Mobile_Number: doc.contactDetails.mobileNumber,
//                     Mother_Name: doc.contactDetails.motherName,
//                     Mother_Number: doc.contactDetails.momNumber,
//                     Father_Name: doc.contactDetails.fatherName,
//                     Father_Number: doc. contactDetails.dadNumber,
//                     Gardian_Name: doc.contactDetails.gardianName,
//                     Gardian_Number: doc.contactDetails.gardianNumber
//                 }
//             })
//         })
//     }