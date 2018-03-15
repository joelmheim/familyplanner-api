import mongoose from 'mongoose';

let Schema = mongoose.Schema;

let ActivitySchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: false },
  location: { type: String, required: false }
});

let EventSchema = new Schema({
  actor: { type: Schema.Types.ObjectId, ref: 'Person', required: true },
  helper: { type: Schema.Types.ObjectId, ref: 'Person', required: false },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  activity: ActivitySchema
}, {
  timestamps: true
});

export default mongoose.model('Event', EventSchema);