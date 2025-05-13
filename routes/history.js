import express from 'express';
import SearchHistoryKeyword from '../models/SearchHistoryKeyword.js';
import SearchHistorySelection from '../models/SearchHistorySelection.js';

const router = express.Router();

// GET /history?type=keywords|selections
router.get('/', async (req, res) => {
  try {
    const { type } = req.query;
    
    if (!type || !['keywords', 'selections'].includes(type)) {
      return res.status(400).json({ 
        error: "Invalid type. Use 'keywords' or 'selections'" 
      });
    }

    const data = type === 'keywords'
      ? await SearchHistoryKeyword.find({}, { _id: 0, keyword: 1 })
      : await SearchHistorySelection.find({}, { _id: 0, itemId: 1, name: 1, type: 1 });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;