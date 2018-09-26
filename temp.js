(req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => { 
            if(user.length >= 1){
                return res.status(409).json({
                    state: false,
                    exist: true
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if(err){
                        return res.status(500).json({     
                        });
                    }else {
                        const address = new Address({
                            _id: new mongoose.Types.ObjectId(),
                            firstLine: req.body.firstLine,
                            secondLine: req.body.secondLine,
                            city: req.body.city,
                            district: req.body.district
                        });
                        const contactDetails = new ContactDetails({
                            _id: new mongoose.Types.ObjectId(),
                            landNumber: req.body.landNumber,
                            mobileNumber: req.body.mobileNumber,
                            motherName: req.body.motherName,
                            momNumber: req.body.momNumber,
                            fatherName: req.body.fatherName, 
                            dadNumber: req.body.dadNumber,
                            gardianName: req.body.gardianName,
                            gardianNumber: req.body.gardianNumber
                        })
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash, 
                            fullName: req.body.fullName,
                            batch: req.body.batch,
                            role: req.body.role,
                            school: req.body.school,
                            subjects: req.body.subjects,
                            stream: req.body.stream,
                            firstName: req.body.firstName,
                            lastName: req.body.lastName,
                            birthday: req.body.birthday,
                            address: address._id,
                            contactDetails: contactDetails._id
                        });

                        contactDetails
                            .save()
                        address
                            .save()
                        user
                            .save()

                            .then(result => {
                                console.log({ 
                                    Message1: ' User Signed up ',
                                    E_mail: req.body.email,
                                    Hashed_password: hash,
                                    Full_Name: req.body.fullName,
                                    Batch: req.body.batch,
                                    Role: req.body.role,
                                    School: req.body.school,
                                    Subject: req.body.subject,
                                    Birthday: req.body.birthday,
                                    Stream: req.body.stream,
                                    Message2: ' Address ',
                                    No: req.body.no,
                                    First_Street: req.body.firstStreet,
                                    Second_Street: req.body.secondStreet,
                                    City: req.body.city,
                                    District: req.body.district,
                                    Meaasge3: ' Contact Details ',
                                    Land_Number: req.body.landNumber,
                                    Mobile_Number: req.body.mobileNumber,
                                    Mom_Number: req.body.momNumber,
                                    Dad_Number: req.body.dadNumber,
                                    Gardian_Number: req.body.gardianNumber
                                }); 
                                res.status(201).json({
                                    state: true,
                                    exist: false
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        })
}