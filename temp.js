// router.delete('/:userId', (req, res ) => {
//     const Id = req.params.userId;
//     console.log(req.params.userId);
//     User
//         .findById(Id)
//         .populate('address contactDetails')
//         .then(result => {
//             if (result.length < 1){
//                 res.status(200).json({
//                     state: false
//                 })
//             } else {
//                 console.log(result)       
//                 Address
//                     .remove({ _id: result.address._id }) 
//                     .then() 
            
//                 ContactDetails  
//                     .remove({ _id: result.contactDetails._id })
//                     .then()
//                 User
//                     .remove({ _id: req.params.userId })
//                     .then()

//                 res.status(200).json({
//                     state: true
//             });
//             }
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).json({
//                 error: err
//             });
//         });
// });


// router.delete('/:userId', (req, res ) => {
//     const Id = req.params.userId;
//     console.log(req.params.userId);
//     User
//         .findById(Id)
//         .populate('address contactDetails')
//         .then(result => {
//             console.log(result)       
//             Address
//                 .remove({ _id: result.address._id }) 
//                 .then() 
        
//             ContactDetails  
//                 .remove({ _id: result.contactDetails._id })
//                 .then()
//             User
//                 .remove({ _id: req.params.userId })
//                 .then()

//             res.status(200).json({
//                 state: true
//             });
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).json({
//                 error: err
//             });
//         });
// });

// {
// 	"email": "test132@gmail.com",
// 	"password": "12345",
// 	"role": "student",
// 	"fullName": "Test full name",
// 	"firstName": "Test first name",
// 	"lastName": "Test last name",
// 	"batch": "2020 A/L",
// 	"subjects": ["Maths","Physics","Chemistry"],
// 	"school": "College",
// 	"birthday": "1995/4/12",
// 	"stream": "English",
// 	"firstLine": "67",
// 	"secondLine": "New Town Road",
// 	"city": "new city",
// 	"district": "test district",
// 	"landNumber": "0453434654",
// 	"mobileNumber": "0772397343",
// 	"motherName": "test name1",
// 	"momNumber": "0713834444",
// 	"fatherName": "test name2",
// 	"dadNumber": "0772345688",
// 	"gardianName": "new name3",
// 	"gardianNumber": "0772345688"
// }

// {
// 	"subjectName": "combined maths",
// 	"hallNo": "34",
// 	"grade": "",
// 	"day": "monday",
// 	"batch": "16",
// 	"time": "10.00AM to 01.00PM",
// 	"teacher": "5bae6b7e66a0dc236c26f66b",
// 	"cardMarker": "5bae6b9866a0dc236c26f66e"
// }