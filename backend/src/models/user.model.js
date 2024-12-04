const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: String,
    userEmail: String,
    verifyCode: String,
    phoneNumber: String,
    birth: Date,
    language: String,
    address: String,
    password: String,
    church: String,
    avatarUrl: String,
    role : String,
    status: Boolean,
    GoogleorFacebook: Boolean,
    notifications:[
        {notificationId : String}
    ]
});

module.exports = mongoose.model('User', userSchema);