const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Payment = require('../models/payment');

router.post('/pay', (req, res, next) => {
    console.log(req.body);
})

module.exports = router; 