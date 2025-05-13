import mongoose from 'mongoose';

const KeywordSchema = new mongoose.Schema({
  keyword: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('SearchHistoryKeyword', KeywordSchema);