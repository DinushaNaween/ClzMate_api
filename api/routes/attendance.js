const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.post('/markAttendance', (req, res, next) => {
    const student = req.body.student;
    const clz = req.body.clz;
});

module.exports = router;