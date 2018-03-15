import mongoose from 'mongoose';

let Schema = mongoose.Schema;

let PersonSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: false },
  image: { type: String, required: false }
}, {
  timestamps: true
});

export default mongoose.model('Person', PersonSchema);