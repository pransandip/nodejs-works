import axios from '../utils/axios';

export const fetchUsersListData = async () => {
  try {
    const res = await axios.post('user/fetch-connected-user', {});
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
export const fetchChatMessagesData = async (param) => {
    try {
      const res = await axios.post(`chat/fetch-messages`,param);
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

  export const sendChatMessage = async (param) => {
    try {
      const res = await axios.post(`chat/send-message`,param);
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
