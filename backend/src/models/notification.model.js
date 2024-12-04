const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    notificationTitle: String,
    notificationType: String,
    churchId: String,
    createdDate: Date,
    description: String,
    status: Boolean
});

module.exports = mongoose.model('Notification', notificationSchema);