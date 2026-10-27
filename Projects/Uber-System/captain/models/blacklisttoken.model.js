const mongoose = require('mongoose')
const blacklistTokenSchema = new mongoose.Schema({
    token:{
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600 // 1 hour in seconds
    }
},{
    timestamps: true
})

module.exports = mongoose.model('blacklisttoken', blacklistTokenSchema)