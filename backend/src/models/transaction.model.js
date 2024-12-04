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
    amount: String,
    createdDate: Date,
    type: String,  
    status: String
});

module.exports = mongoose.model('Transaction', transactionSchema);