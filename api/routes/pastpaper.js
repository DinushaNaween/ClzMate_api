const express = require('express');
const router = express.Router();

router.get('/', (req, res, next)=>{
    res.status(200).json({
        message: 'GET paper'
    });
});

router.post('/', (req, res, next)=>{
    res.status(200).json({
        message: 'POST paper'
    })
})

module.exports = router;