const jwt = require('jsonwebtoken');
const axios = require('axios');

module.exports.userAuth = async (req, res, next) => {
    try {
         const token = req.cookies?.token || req.headers.authorization?.match(/^Bearer\s+(.+)$/i)?.[1];

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const response = await axios.get(`${process.env.BASE_URL}/user/profile`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const user = response.data;

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        req.user = user;
        
        next();

    }catch(error){
        res.status(500).json({success:false, message:error.message});
        console.log("Error in userAuth",error)
    }
}
