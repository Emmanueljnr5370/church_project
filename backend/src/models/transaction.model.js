const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },   
    churchId: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Church'
    },
    projectId: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    reference : {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    amount: String,
    createdDate: Date,
    type: String,  
    status: String
});

module.exports = mongoose.model('Transaction', transactionSchema);