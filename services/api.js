import axios from 'axios';

const BASE_URL = 'https://fortniteapi.io/v2';
const API_KEY = process.env.FORTNITE_API_KEY;

export const searchByKeyword = async (keyword) => {
  try {
    const response = await axios.get(`${BASE_URL}/items/list`, {
      headers: { Authorization: API_KEY },
      params: { search: keyword }
    });
    return response.data.items 
      ? Object.values(response.data.items).flat()
      : [];
  } catch (error) {
    throw new Error(`API Error: ${error.message}`);
  }
};

export const getDetailsById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/items/get`, {
      headers: { Authorization: API_KEY },
      params: { id }
    });
    return response.data.item || {};
  } catch (error) {
    throw new Error(`API Error: ${error.message}`);
  }
};