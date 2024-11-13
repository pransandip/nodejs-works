import axios from '../../utils/axios';

export const fetchDataApi = async (endpoint, params) => {
  try {
    const res = await axios.get(endpoint, params);
    if (res.status === 201) {
      return res.data;
    } else {
      console.error('Non-successful status code:', res.status);
      throw new Error(`Non-successful status code: ${res.status}`);
    }
  } catch (error) {
    console.error('Error fetching owned cards:', error);
    throw error;
  }
};
