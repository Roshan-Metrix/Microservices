const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
const blacklisttokenModel = require('../models/blacklisttoken.model');

module.exports.userAuth = async (req, res, next) => {
    try{
        const token = req.cookies?.token || req.headers.authorization?.match(/^Bearer\s+(.+)$/i)?.[1];

        const isBlacklisted = await blacklisttokenModel.findOne({token});

        if(isBlacklisted || !token){
            return res.status(401).json({success: false, message: 'Unauthorized Access'});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decoded.id)

        if(!user){
            return res.status(401).json({success: false, message:'Unauthorized'});
        }

        req.user = user;
        next();
    }catch(error){
        res.status(500).json({success:false, message:error.message});
    }
}