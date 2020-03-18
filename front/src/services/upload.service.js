import axios from 'axios';

export default {
  upload: async (data, progress) => {
    let res = await axios.post(`/api/upload`, data, progress);
    return res.data || [];
  }
}