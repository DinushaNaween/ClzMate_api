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