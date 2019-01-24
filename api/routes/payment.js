const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Payment = require('../models/payment');

router.post('/payHereResponce', (req, res, next) => {
    const payment = new Payment({
        _id: new mongoose.Types.ObjectId(),
        merchant_id: req.body.merchant_id,
        order_id: req.body.order_id,
        payment_id: req.body.payment_id,
        payhere_amount: req.body.payhere_amount,
        payhere_currency: req.body.payhere_currency,
        status_code: req.body.status_code,
        md5sig: req.body.md5sig,
        custom_1: req.body.custom_1,
        custom_2: req.body.custom_2
    });
    payment
        .save()
})

router.get('/test', (req, res, nexy) => {
    const merchant_id = "1212111"
    const return_url = "http://localhost:3000/payment/test/"
    const cancel_url = "http://localhost:3000/payment/test/"
    const notify_url = "http://localhost:3000/payment/test/"
    const first_name = "Dinusha"
    const last_name = "Naveen"
    const email = "dldndasanayaka@gmail.com"
    const phone = "0714778295"
    const address = "30/A, Colincrasent"
    const city = "Rathnapura"
    const country = "Sri Lanka"
    const order_id = "1212"
    const items = "smart phone"
    const currency = "LKR"
    const amount = 10000
})

module.exports = router; 