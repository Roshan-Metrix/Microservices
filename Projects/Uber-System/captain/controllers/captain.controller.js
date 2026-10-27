const captainModel = require('../models/captain.model');
const blacklisttokenModel = require('../models/blacklisttoken.model')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports.register = async (req, res) => {
    try{
        const { name, email, password } = req.body;
        const captain = await captainModel.findOne({email});

        if(captain){
            return res.status(400).json({success: false, message:'captain already registered'})
        }

        const hashPass = await bcrypt.hash(password, 10);
        const newcaptain = await captainModel.create({
            name,
            email,
            password: hashPass
    })

        const token = jwt.sign({ id: newcaptain._id}, process.env.JWT_SECRET, {expiresIn: '1h'});

        res.cookie('token', token);

        delete newcaptain._doc.password;

        res.send({token, newcaptain});
    }catch(err){
        res.status(500).json({success: false, message: err.message});
        console.log("Error in register controller:", err)
    }
}

module.exports.login = async (req, res) => {
    try{
        const { email, password } = req.body;
        const captain = await captainModel.findOne({email}).select('+password');

        if(!captain){
            return res.status(400).json({success: false, message: 'Invalid email or password'});
        }

        const isMatch = await bcrypt.compare(password, captain.password);

        if(!isMatch){
            return res.status(400).json({succuss: false, message:'Invalid email or password'});
        }
        const token = jwt.sign({id: captain._id}, process.env.JWT_SECRET,{expiresIn:'1h'});

        res.cookie('token', token);

        delete captain._doc.password;
        res.send({token, captain});
    }catch(error){
        res.status(500).json({success:false, message: error.message});
    }
}

module.exports.logout = async (req, res) => {
    try{
        const token = req.cookies.token;
        await blacklisttokenModel.create({ token })
        res.clearCookie('token')
        res.send({success:true, message:'captain logged out successfully'});
    }catch(error){
        res.status(500).json({success:false, message: error.message });
    }
}

module.exports.profile = async (req, res) => {
    try{
        delete req.captain._doc.password;
        res.send(req.captain);
    }catch(error){
        res.status(500).json({success:false, message: error.message});
    }
}