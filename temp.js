// bcrypt.hash(req.body.password, 10, (err, hash) => {
//     if(err){
//         return res.status(401).json({
//             Message: 'error'
//         })
//     } else {
//         bcrypt.compare(hash, user[0].password, (err, result) => {
//             if (err){
//                 return res.status(401).json({
//                     message: 'Authantication Failed. Password is incorrect.'
//                 });
//             }
//             if (result){
//                 token = jwt.sign({user: user}, 'secretkey',(err, token) => {
//                     if(err){
//                         res.json({ error: err })
//                     } else {
//                         console.log('Token is:- '+token);
//                         return res.status(200).json({
//                             Database_password: user[0].password,
//                             current_password: req.body.password,
//                             Message: 'User Logged in',
//                             Email: req.body.email,
//                             JWT_Token: token
//                         })
//                     }
//                     console.log('token genetas : '+ this.token);
//                 });
//             }
//         });
//     }
// });

// router.get('/', (req, res) => {
//     Address
//         .find()
//         .exec()
//         .populate('User')
//         .then(docs => {

//         })
// })