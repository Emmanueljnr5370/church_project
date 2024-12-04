const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    church: [
        {
            label: String,
            value: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Church'
            },
        }
    ],
    churchPermission: { type: Boolean, default: false },
    notificationPermission: { type: Boolean, default: false },
    transactionPermission: { type: Boolean, default: false }
});

module.exports = mongoose.model('Role', roleSchema);