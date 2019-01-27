const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Payment = require('../models/payment');
const paymentController = require('../controllers/paymentController');

//receive payment responce from payhere
router.post('/payHereResponce', paymentController.checkStatus, (req, res, next) => {
    const payment = new Payment({
        _id: new mongoose.Types.ObjectId(),
        merchant_id: req.body.merchant_id,
        order_id: req.body.order_id,
        payment_id: req.body.payment_id,
        payhere_amount: req.body.payhere_amount,
        payhere_currency: req.body.payhere_currency,
        status_code: req.body.status_code,
        status: req.body.status,
        md5sig: req.body.md5sig,
        custom_1: req.body.custom_1,     //student
        custom_2: req.body.custom_2      //clz
    });
    console.log(payment);
    payment     
        .save()
        .then(result => {
            res.status(200).json({
                result
            })
        })
        .catch(err => {
            res.status(500).json({
                err
            })
        })
})

//get all payments in database
router.get('/', (req, res, next) => {
    Payment
        .find()
        .populate('custom_1 custom_2', `clzNo indexNo`)
        .exec()
        .then(payments => {
            res.status(200).json({
                Payments: payments
            })
        })
        .catch(err => {
            res.status(500).json({
                state: false
            })
        })
})

//get payments of a clz
router.get('/:clzId', (req, res, next) => {
    const clzId = req.params.clzId;
    Payment
        .find({ custom_2: clzId })       //custom_2 = clz
        .exec()
        .then(payments => {
            res.status(200).json({
                payments
            })
        })
        .catch(err => {
            res.status(500).json({
                state: false
            })
        })
})

router.get("/getPaymentByStudent/:studentId", (req, res, next) => {
    const studentId = req.params.studentId;
    Payment
        .find({ custom_1: studentId })
        .exec()
        .then(Payments => {
            res.status(200).json({
                Payments
            })
        })
        .catch(err => {
            res.status(500).json({
                state: false
            })
        })
})

module.exports = router; 