const jwt = require('jsonwebtoken');

function checkToken(req, res, next){
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decode = jwt.verify(token, process.env.JWT_KEY);
        req.body.requester = decode;
        next();
    } catch(err) {
        return res.status(401).json({
                    state: false,
                    message: "error in check token"
        });
    }
}

module.exports = {
    checkToken: checkToken
}