const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PersonSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: false },
    image: { type: String, required: false }
}, {
    timestamps: true
});

module.exports = mongoose.model('Person', PersonSchema);