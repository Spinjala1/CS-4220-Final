import express from 'express';
import { searchByKeyword, getDetailsById } from '../services/api.js';
import SearchHistoryKeyword from '../models/SearchHistoryKeyword.js';
import SearchHistorySelection from '../models/SearchHistorySelection.js';

const router = express.Router();

// GET /fortnite?keyword=...
router.get('/', async (req, res) => {
  console.log('\n=== NEW SEARCH REQUEST ===');
  console.log('Query parameters:', req.query);
  console.log('Headers:', req.headers);

  try {
    const { keyword } = req.query;
    console.log('Raw keyword:', keyword);

    if (!keyword) {
      console.log('Keyword validation failed - empty input');
      return res.status(400).json({ error: 'Keyword required' });
    }

    const trimmedKeyword = keyword.trim();
    console.log('Trimmed keyword:', trimmedKeyword);

    // Save to MongoDB
    console.log('Attempting to save to SearchHistoryKeyword...');
    await SearchHistoryKeyword.findOneAndUpdate(
      { keyword: trimmedKeyword },
      { keyword: trimmedKeyword },
      { upsert: true, new: true }
    );
    console.log('Saved to search history');

    // API Call
    console.log(`Calling Fortnite API with keyword: "${trimmedKeyword}"`);
    const results = await searchByKeyword(trimmedKeyword);
    console.log('Raw API results:', results);

    if (!Array.isArray(results)) {
      console.error('Unexpected API response format:', typeof results);
      return res.status(500).json({ error: 'Invalid API response format' });
    }

    const formatted = results.map(item => ({
      display: `${item.name} (${item.rarity?.name || 'Unknown'})`,
      identifier: item.id
    }));
    console.log('Formatted results:', formatted);

    res.json(formatted);
  } catch (err) {
    console.error('SEARCH ERROR:', err);
    res.status(500).json({ 
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

// GET /fortnite/:id
router.get('/:id', async (req, res) => {
  console.log('\n=== NEW DETAILS REQUEST ===');
  console.log('Item ID:', req.params.id);

  try {
    const itemId = req.params.id;
    console.log('Fetching details for ID:', itemId);

    const item = await getDetailsById(itemId);
    console.log('Raw item details:', item);

    if (!item || !item.id) {
      console.log('Item not found');
      return res.status(404).json({ error: 'Item not found' });
    }

    // Save selection
    console.log('Saving to SearchHistorySelection...');
    await SearchHistorySelection.findOneAndUpdate(
      { itemId: item.id },
      { 
        itemId: item.id,
        name: item.name,
        type: item.type?.name 
      },
      { upsert: true, new: true }
    );

    const responseData = {
      name: item.name,
      description: item.description,
      rarity: item.rarity?.name,
      type: item.type?.name
    };
    console.log('Sending response:', responseData);

    res.json(responseData);
  } catch (err) {
    console.error('DETAILS ERROR:', err);
    res.status(500).json({ 
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

export default router;