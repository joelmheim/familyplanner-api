const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActivitySchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: false },
    location: { type: String, required: false }
});

const EventSchema = new Schema({
    actor: { type: Schema.Types.ObjectId, ref: 'Person', required: true },
    helper: { type: Schema.Types.ObjectId, ref: 'Person', required: false },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    activity: ActivitySchema
}, {
    timestamps: true
});

module.exports = mongoose.model('Event', EventSchema);