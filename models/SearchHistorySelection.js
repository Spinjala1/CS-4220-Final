import mongoose from 'mongoose';

const SelectionSchema = new mongoose.Schema({
  itemId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('SearchHistorySelection', SelectionSchema);