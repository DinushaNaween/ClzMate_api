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

router.get('/:classId', (req, res, next) => {
    const id = req.params.classId;
    if (id === 'special'){
        res.status(200).json({
            message: 'special ID',
            id: id
        });
    } else {
        res.status(200).json({
            message: 'Not Special'
        });
    }
});

router.patch('/:classId', (req, res, next)=>{
    res.status(200).json({
        message: 'PATCH'
    });
});

router.delete('/:classId', (req, res, next)=>{
    res.status(200).json({
        message: 'DELETE'
    });
});

module.exports = router;