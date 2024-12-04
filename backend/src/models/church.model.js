const mongoose = require('mongoose');

const churchSchema = new mongoose.Schema({
    churchName: String,
    churchAddress: String,
    photoUrl: String,
    status: Boolean,
});

module.exports = mongoose.model('Church', churchSchema);