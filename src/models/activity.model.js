import mongoose from 'mongoose';

let Schema = mongoose.Schema;

let ActivitySchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: false },
  location: { type: String, required: false }
}, {
  timestamps: true
});

export default mongoose.model('Activity', ActivitySchema);