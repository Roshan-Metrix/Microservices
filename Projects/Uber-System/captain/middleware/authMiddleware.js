const jwt = require('jsonwebtoken');
const captainModel = require('../models/captain.model');
const blacklisttokenModel = require('../models/blacklisttoken.model');

module.exports.captainAuth = async (req, res, next) => {
    try{
        const token = req.cookies?.token || req.headers.authorization?.match(/^Bearer\s+(.+)$/i)?.[1];

        const isBlacklisted = await blacklisttokenModel.findOne({token});

        if(isBlacklisted || !token){
            return res.status(401).json({success: false, message: 'Unauthorized Access'});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const captain = await captainModel.findById(decoded.id).select('-password');

        if(!captain){
            return res.status(401).json({success: false, message:'Unauthorized'});
        }

        req.captain = captain;
        next();
    }catch(error){
        res.status(500).json({success:false, message:error.message});
    }
}