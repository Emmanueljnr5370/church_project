const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    churchId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Church'
    },
    projectName: String,
    projectPhoto: String,
    projectDescription: String,
});

module.exports = mongoose.model('Project', projectSchema);