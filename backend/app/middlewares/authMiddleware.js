const jwt = require("jsonwebtoken");
const staffModel = require('../models/staffsModel');
const { jwtSecret } = require('../config/config');

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');
    // console.log("token ",token)
    if (!token) {
        return res.status(401).json({
            status:false,
            message: "Unauthorized-token"
        });
    }
    // console.log("jwtSecret ",jwtSecret)
    jwt.verify(token, jwtSecret, async (err, decoded) => {
        if (err) {
            return res.status(401).json({
                status:false,
                message: "Unauthorized-token"
            });
        }

        try {
         
            const user = await staffModel.isLoginAuthTokenCheckmodel({id:decoded.userId , login_auth_token: token});
            // console.log("user ",user)
            if (!user || user.login_auth_token !== token) {
                return res.status(401).json({
                    status:false,
                    message: "Unauthorized-token"
                });
            }
            req.userId = decoded.userId;
            next();
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error dddd"
            });
        }
    });
};

module.exports = { verifyToken };