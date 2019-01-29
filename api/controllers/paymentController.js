const md5 = require('md5');

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

function md5sigValidate(req, res, next){
    const received_md5sig = req.body.md5sig;
    const merchant = req.body.merchant_id;
    const order = req.body.order_id;
    const amount = req.body.payhere_amount;
    const currency = req.body.payhere_currency;
    const status_code = req.body.status_code;

    const generated_md5sig = str.toUpperCase( md5( merchant + order + amount + currency + status_code + str.toUpperCase( md5(process.env.PAYHERE_SECRET))));

    console.log(received_md5sig);
    console.log(generated_md5sig);

    if(received_md5sig == generated_md5sig){
        next()
    } else{
        res.status(500).json({
            state: false
        })
    }
}

module.exports = {
    checkStatus: checkStatus,
    md5sigValidate: md5sigValidate
}