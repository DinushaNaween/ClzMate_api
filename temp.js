// db.users.aggregate([{
//     $lookup: {
//         from: "addresses",
//         localField: "_id",
//         foreignField: "_id",
//         as: "FullUser"
//     }
// }])