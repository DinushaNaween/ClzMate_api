const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

function decode(req, res, next){
    const token = req.headers.token;
    const decodeJWT = jwt.verify(token, process.env.JWT_KEY);
    return decodeJWT;
}

function authenticate(req, res, next) {
    try {
        const decodeJWT = decode(req, res, next);
        req.userData = decodeJWT;
        console.log(decodeJWT);
        next();
    } catch (error) {
        return res.status(401).json({
            Message: 'Auth failed'
        });
    }   
}

function checkIfSpecialUser(req, res, next) {
    try {
        const decodeJWT = decode(req, res, next);
        req.userData = decodeJWT;
        if (decodeJWT.user.role === 'admin' || decodeJWT.user.role === 'teacher'){
            next()
        } else{
            return res.status(200).json({
                Message: 'Oops!.... Not Enough Permissions'
            });
        }
    } catch (error) {
        res.status(401).json({
            state: false
        })
    }
}

function checkIfGeneralUser(req, res, next) {
    try {
        const decodeJWT = decode(req, res, next)
        req.userData = decodeJWT;
        if (decodeJWT.user.role === 'parent' || decodeJWT.user.role === 'student'){
            next()
        } else{
            return res.status(200).json({
                Message: 'Oops!.... Not Enough Permissions'
            });
        }
    } catch (error) {
        res.status(401).json({
            state: false
        })
    }
}

function checkIfSuperUser(req, res, next) {
    try {
        const decodeJWT = decode(req, res, next)
        req.userData = decodeJWT;
        if (decodeJWT.user.role === 'parent' || decodeJWT.user.role === 'student' ||
            decodeJWT.user.role === 'admin' || decodeJWT.user.role === 'teacher'){
            next()
        } else{
            return res.status(200).json({
                Message: 'Oops!.... Not Enough Permissions'
            });
        }
    } catch (error) {
        res.status(401).json({
            state: false
        })
    }
}

function checkIfAdmin(req, res, next) {
    try {
        const decodeJWT = decode(req, res, next);
        req.userData = decodeJWT;
        if (decodeJWT.user.role === 'admin'){
            next()
        } else{
            return res.status(200).json({
                Message: 'Oops!.... Not Enough Permissions'
            });
        }
    } catch (error) {
        res.status(401).json({
            state: false
        })
    }
}

function checkIfPaperMarker(req, res, next) {
    try {
        const decodeJWT = decode(req, res, next);
        req.userData = decodeJWT;
        if (decodeJWT.user.role === 'papermarker'){
            next()
        } else{
            return res.status(200).json({
                Message: 'Oops!.... Not Enough Permissions'
            });
        }
    } catch (error) {
        res.status(401).json({
            state: false
        })
    }
}

module.exports = {
    authenticate: authenticate,
    checkIfAdmin: checkIfAdmin,
    checkIfPaperMarker: checkIfPaperMarker,
    checkIfSuperUser: checkIfSuperUser,
    checkIfSpecialUser: checkIfSpecialUser,
    checkIfGeneralUser: checkIfGeneralUser
};