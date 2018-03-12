const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ActivitySchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: false },
    location: { type: String, required: false }
}, {
    timestamps: true
});

module.exports = mongoose.model('Activity', ActivitySchema);