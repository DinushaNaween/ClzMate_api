const Payment = require('../models/payment');

function checkStatus(req, res, next){
    const statusCode = req.body.status_code;
    if(statusCode == 2){
        req.body.status = "Success";
        next()
    } else if(statusCode == 0){
        req.body.status = "Pending";
        next()
    } else if(statusCode == -1){
        req.body.status = "Canceled";
        next()
    } else if(statusCode == -2){
        req.body.status = "Failed";
        next()
    } else{
        req.body.status = "Chargedback"
        next()
    }
}

module.exports = {
    checkStatus: checkStatus
}