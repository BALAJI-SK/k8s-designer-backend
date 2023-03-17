const jwt = require('jsonwebtoken');
require('dotenv').config();
const httpConstants = require('http2').constants;

const checkAuth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userData = decoded;
        next();
    } catch (error) {
        return res.status(httpConstants.HTTP_STATUS_UNAUTHORIZED).json({
            message: 'Auth failed'
        });
    }
}

module.exports = checkAuth;