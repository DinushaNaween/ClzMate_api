const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Payment = require('../models/payment');

router.post('/pay', (req, res, next) => {
    console.log("Hello");
    console.log(req.body);
    res.status(200).json({
        message: "payment post",
        result: req.body
    })
})

module.exports = router; 